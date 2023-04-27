package uk.ac.bham.teamproject.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.FinalGroup;

/**
 * Spring Data JPA repository for the FinalGroup entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FinalGroupRepository extends JpaRepository<FinalGroup, Long>, JpaSpecificationExecutor<FinalGroup> {}
