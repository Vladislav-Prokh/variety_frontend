<template>
    <div id="aboutUsRoot">
        <page-header></page-header>

        <div id="content">
            <div id="aboutUs">

          
                <h2>{{ $t('aboutUsText.headline') }}</h2>
                <p>{{ $t('aboutUsText.intro') }}</p>
                <h4>Policy</h4>
                <ul>
                  <li v-for="(value, key) in { 'statement1': true, 'statement2': true, 'statement3': true }" :key="key">
                    <span>{{ $t('aboutUsText.shopPolicy.' + key) }}</span>
                  </li>
                </ul>
                <h4>  {{ $t('aboutUsText.returnMoneyPolicyName') }}</h4>
                <ul>
                  <li v-for="(value, key) in { 'statement1': true, 'statement2': true, 'statement3': true }" :key="key">
                    <span>{{ $t('aboutUsText.returnMoneyPolicy.' + key) }}</span>
                  </li>
                </ul>
                <p>{{ $t('aboutUsText.conclusion') }}</p>
               


            </div>
        </div>

        <page-footer></page-footer>
    </div>
</template>

<script>
import PageHeader from '../../PageHeader.vue'
import PageFooter from '../../PageFooter.vue';

export default {

  components: {
    PageHeader,
    PageFooter,
  },
  data(){
    return {
    }
  }

}
</script>

<style scoped>
#aboutUsRoot {
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
}

#content {
  flex: 1; 
  height: 100%;
  width: 100%;
}

#aboutUs {
  width: 50%;
  margin: auto;
}

h2 {
  margin-top: 40px;
  text-align: center;
}

p {
  margin-bottom: 20px;
  text-align: justify; 
}

h4 {
  text-align: center; 
}

ul {
  list-style-type: square;
  margin-top: 3%;
  padding-left: 20px; 
}

li {
  margin: 10px 0;
  text-align: justify; 
}

</style>
