import os
import time
import logging
from celery import shared_task
from django.conf import settings
from .models import TryOnGenerationSession
from .services.tryon_engine import execute_virtual_tryon

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=2)
def generate_vton_session_task(self, session_id, front_image_path, back_image_path=None):
    """
    Celery asynchronous background task to run heavy OpenCV / PIL Virtual Try-On
    without blocking the Django HTTP request thread.
    """
    start_time = time.time()
    try:
        session = TryOnGenerationSession.objects.select_related('model_profile').get(id=session_id)
    except TryOnGenerationSession.DoesNotExist:
        logger.error(f"[VTON TASK] Session {session_id} does not exist.")
        return {'success': False, 'error': f"Session {session_id} not found."}

    session.status = 'processing'
    session.save(update_fields=['status'])

    try:
        # Read front image
        if not os.path.exists(front_image_path):
            raise FileNotFoundError(f"Front image file not found: {front_image_path}")

        with open(front_image_path, 'rb') as f:
            front_bytes = f.read()

        back_bytes = None
        if back_image_path and os.path.exists(back_image_path):
            with open(back_image_path, 'rb') as f:
                back_bytes = f.read()

        result = execute_virtual_tryon(
            front_image_file_or_bytes=front_bytes,
            back_image_file_or_bytes=back_bytes,
            model_slug=session.model_profile.slug,
            angles=session.selected_angles,
            garment_type=session.garment_type,
            fit_silhouette=session.fit_silhouette,
            tuck_style=session.tuck_style,
            backdrop_style=session.backdrop_style,
            session=session
        )

        elapsed_ms = int((time.time() - start_time) * 1000)
        session.status = 'completed'
        session.generation_time_ms = elapsed_ms
        session.save(update_fields=['status', 'generation_time_ms'])
        logger.info(f"[VTON TASK] Successfully completed session {session_id} in {elapsed_ms}ms")

        # Clean up temporary uploaded input files if stored in temporary directory
        for p in [front_image_path, back_image_path]:
            if p and os.path.exists(p) and 'tmp_inputs' in p:
                try:
                    os.unlink(p)
                except Exception:
                    pass

        return {
            'success': True,
            'session_id': session.id,
            'generation_time_ms': elapsed_ms,
            'data': result
        }

    except Exception as exc:
        logger.error(f"[VTON TASK] Error processing session {session_id}: {exc}", exc_info=True)
        session.status = 'failed'
        session.error_message = str(exc)
        session.save(update_fields=['status', 'error_message'])
        return {'success': False, 'error': str(exc)}

