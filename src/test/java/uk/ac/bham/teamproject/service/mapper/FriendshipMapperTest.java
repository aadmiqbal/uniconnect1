package uk.ac.bham.teamproject.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class FriendshipMapperTest {

    private FriendshipMapper friendshipMapper;

    @BeforeEach
    public void setUp() {
        friendshipMapper = new FriendshipMapperImpl();
    }
}
