package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.FinalUser;

/**
 * Spring Data JPA repository for the FinalUser entity.
 */
@Repository
public interface FinalUserRepository extends JpaRepository<FinalUser, Long>, JpaSpecificationExecutor<FinalUser> {
    default Optional<FinalUser> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<FinalUser> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<FinalUser> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct finalUser from FinalUser finalUser left join fetch finalUser.user",
        countQuery = "select count(distinct finalUser) from FinalUser finalUser"
    )
    Page<FinalUser> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct finalUser from FinalUser finalUser left join fetch finalUser.user")
    List<FinalUser> findAllWithToOneRelationships();

    @Query("select finalUser from FinalUser finalUser left join fetch finalUser.user where finalUser.id =:id")
    Optional<FinalUser> findOneWithToOneRelationships(@Param("id") Long id);
}
