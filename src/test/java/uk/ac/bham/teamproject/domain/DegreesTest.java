package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class DegreesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Degrees.class);
        Degrees degrees1 = new Degrees();
        degrees1.setId(1L);
        Degrees degrees2 = new Degrees();
        degrees2.setId(degrees1.getId());
        assertThat(degrees1).isEqualTo(degrees2);
        degrees2.setId(2L);
        assertThat(degrees1).isNotEqualTo(degrees2);
        degrees1.setId(null);
        assertThat(degrees1).isNotEqualTo(degrees2);
    }
}
