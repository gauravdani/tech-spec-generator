import { useState, useCallback } from 'react';
import { FormState } from '../types/events';

interface ValidationErrors {
  businessType?: string;
  platformType?: string;
  deviceType?: string;
  trackingTool?: string;
  selectedEvents?: string;
}

export const useFormValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = useCallback((formData: FormState): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.businessType) {
      newErrors.businessType = 'Business type is required';
    }

    if (!formData.platformType) {
      newErrors.platformType = 'Platform type is required';
    }

    if (!formData.deviceType) {
      newErrors.deviceType = 'Device type is required';
    }

    if (!formData.trackingTool) {
      newErrors.trackingTool = 'Tracking tool is required';
    }

    if (!formData.selectedEvents.length) {
      newErrors.selectedEvents = 'Please select at least one event';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  return { errors, validateForm };
}; 