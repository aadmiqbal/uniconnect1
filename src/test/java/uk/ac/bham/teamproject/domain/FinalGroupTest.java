package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class FinalGroupTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FinalGroup.class);
        FinalGroup finalGroup1 = new FinalGroup();
        finalGroup1.setId(1L);
        FinalGroup finalGroup2 = new FinalGroup();
        finalGroup2.setId(finalGroup1.getId());
        assertThat(finalGroup1).isEqualTo(finalGroup2);
        finalGroup2.setId(2L);
        assertThat(finalGroup1).isNotEqualTo(finalGroup2);
        finalGroup1.setId(null);
        assertThat(finalGroup1).isNotEqualTo(finalGroup2);
    }
}
