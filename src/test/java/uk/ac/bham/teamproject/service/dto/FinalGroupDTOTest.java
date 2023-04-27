package uk.ac.bham.teamproject.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import uk.ac.bham.teamproject.web.rest.TestUtil;

class FinalGroupDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(FinalGroupDTO.class);
        FinalGroupDTO finalGroupDTO1 = new FinalGroupDTO();
        finalGroupDTO1.setId(1L);
        FinalGroupDTO finalGroupDTO2 = new FinalGroupDTO();
        assertThat(finalGroupDTO1).isNotEqualTo(finalGroupDTO2);
        finalGroupDTO2.setId(finalGroupDTO1.getId());
        assertThat(finalGroupDTO1).isEqualTo(finalGroupDTO2);
        finalGroupDTO2.setId(2L);
        assertThat(finalGroupDTO1).isNotEqualTo(finalGroupDTO2);
        finalGroupDTO1.setId(null);
        assertThat(finalGroupDTO1).isNotEqualTo(finalGroupDTO2);
    }
}
