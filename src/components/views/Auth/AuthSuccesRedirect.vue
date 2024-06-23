<template>
        <div id  ="AuthRedirectRoots">
        </div>
</template>


<script>

export default{
    mounted() {
      const params = new URLSearchParams(window.location.search);
        const jwtToken = params.get('jwtToken');
        const email = params.get('email');
        const userId = params.get('userId');
        const roles = params.get('roles');
        if (jwtToken) {
            localStorage.setItem('jwtToken', jwtToken);
        }

        if (email) {
            localStorage.setItem('emailUser', email);
        }

        if (userId) {
            localStorage.setItem('user_id', userId);
        }

        if (roles) {
            localStorage.setItem('userRoles', roles);
        }

        this.$router.push('/home');

    this.$router.push('/home');
  }
}
</script>

<style>
</style>