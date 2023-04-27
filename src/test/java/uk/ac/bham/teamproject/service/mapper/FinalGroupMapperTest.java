package uk.ac.bham.teamproject.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class FinalGroupMapperTest {

    private FinalGroupMapper finalGroupMapper;

    @BeforeEach
    public void setUp() {
        finalGroupMapper = new FinalGroupMapperImpl();
    }
}
