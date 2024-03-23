import { defineComponent, ref, type Ref, computed } from 'vue';
import axios from 'axios';

import { useStore } from '@/store';

export default defineComponent({
  compatConfig: { MODE: 3 },
  name: 'Sessions',
  setup() {
    const store = useStore();

    const success: Ref<string> = ref(null);
    const error: Ref<string> = ref(null);
    const sessions: Ref<any[]> = ref([]);

    const authenticated = computed(() => store.authenticated);
    const username = computed(() => store.account?.login ?? '');

    return {
      success,
      error,
      sessions,
      authenticated,
      username,
    };
  },
  created(): void {
    this.retrieveSessions();
  },
  methods: {
    retrieveSessions() {
      return axios.get('api/account/sessions').then(response => {
        this.error = null;
        this.sessions = response.data;
      });
    },
    invalidate(session) {
      return axios
        .delete('api/account/sessions/' + session)
        .then(() => {
          this.error = null;
          this.success = 'OK';
          this.retrieveSessions();
        })
        .catch(() => {
          this.success = null;
          this.error = 'ERROR';
        });
    },
  },
});
