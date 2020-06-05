import messages from '@/utils/messages';

export default {
  methods: {
    getValidationErrors({ path, methods, hints }) {
      let inputValue = path.split('.').reduce( (acc, item) => acc && acc[item] || null, this.$v);

      const errors = [];
      if (!inputValue.$dirty) return errors;

      methods.forEach( method => !inputValue[method] && errors.push(hints[method]) );
      return errors;
    },
    getServerErrors(e) {
      let errors = e.response
      ? messages[e.response.data.error.message] || 'Sorry there was an error'
      : 'Sorry there was an error';
      return errors;
    },
  },
};