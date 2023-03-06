package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.Degrees;

/**
 * Spring Data JPA repository for the Degrees entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DegreesRepository extends JpaRepository<Degrees, Long> {}
