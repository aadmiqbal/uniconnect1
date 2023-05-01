package uk.ac.bham.teamproject.repository;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.Message;

/**
 * Spring Data JPA repository for the Message entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MessageRepository extends JpaRepository<Message, Long>, JpaSpecificationExecutor<Message> {
    @Query(
        "SELECT m FROM Message m WHERE (m.senderId = :senderId AND m.recieverId = :receiverId) OR (m.senderId = :receiverId AND m.recieverId = :senderId) ORDER BY m.timestamp ASC"
    )
    List<Message> findMessagesBetween(@Param("senderId") Integer senderId, @Param("receiverId") Integer receiverId);
}
