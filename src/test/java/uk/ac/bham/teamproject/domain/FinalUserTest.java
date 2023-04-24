package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class FinalUserTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FinalUser.class);
        FinalUser finalUser1 = new FinalUser();
        finalUser1.setId(1L);
        FinalUser finalUser2 = new FinalUser();
        finalUser2.setId(finalUser1.getId());
        assertThat(finalUser1).isEqualTo(finalUser2);
        finalUser2.setId(2L);
        assertThat(finalUser1).isNotEqualTo(finalUser2);
        finalUser1.setId(null);
        assertThat(finalUser1).isNotEqualTo(finalUser2);
    }
}
