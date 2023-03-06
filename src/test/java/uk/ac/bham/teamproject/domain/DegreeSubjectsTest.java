package uk.ac.bham.teamproject.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class DegreeSubjectsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DegreeSubjects.class);
        DegreeSubjects degreeSubjects1 = new DegreeSubjects();
        degreeSubjects1.setId(1L);
        DegreeSubjects degreeSubjects2 = new DegreeSubjects();
        degreeSubjects2.setId(degreeSubjects1.getId());
        assertThat(degreeSubjects1).isEqualTo(degreeSubjects2);
        degreeSubjects2.setId(2L);
        assertThat(degreeSubjects1).isNotEqualTo(degreeSubjects2);
        degreeSubjects1.setId(null);
        assertThat(degreeSubjects1).isNotEqualTo(degreeSubjects2);
    }
}
