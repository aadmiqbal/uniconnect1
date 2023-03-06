package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.Connections;

/**
 * Spring Data JPA repository for the Connections entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ConnectionsRepository extends JpaRepository<Connections, Long> {}
