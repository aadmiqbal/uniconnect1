package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class AppUserLoginsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AppUserLogins.class);
        AppUserLogins appUserLogins1 = new AppUserLogins();
        appUserLogins1.setId(1L);
        AppUserLogins appUserLogins2 = new AppUserLogins();
        appUserLogins2.setId(appUserLogins1.getId());
        assertThat(appUserLogins1).isEqualTo(appUserLogins2);
        appUserLogins2.setId(2L);
        assertThat(appUserLogins1).isNotEqualTo(appUserLogins2);
        appUserLogins1.setId(null);
        assertThat(appUserLogins1).isNotEqualTo(appUserLogins2);
    }
}
