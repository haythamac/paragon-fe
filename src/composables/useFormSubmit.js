import { ref } from 'vue';
import { toast } from 'vue-sonner';

export function useFormSubmit(apiCall, options = {}) {
    const isLoading = ref(false);
    const errors = ref({});

    async function submit(formData){
        isLoading.value = true;
        errors.value = {};

        try {
            const response = await apiCall(formData);
            
            // Get message from API response
            const message = response.data.message || 'Success!';
            toast.success(message);

            return response;
        } catch (err) {
            const message = err.response?.data?.message || 'Something went wrong';
            toast.error(message);

            // Store field-specific errors for inline display
            if (err.response?.data?.errors) {
                errors.value = err.response.data.errors;
            }
            
            throw err;
        } finally {
            isLoading.value = false;
        }
    }
    return { submit, isLoading, errors };
}

