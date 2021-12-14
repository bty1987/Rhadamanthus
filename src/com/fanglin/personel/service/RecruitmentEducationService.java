/**
 * Title: UserContractService
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.personel.service;

import java.util.List;

import com.fanglin.personel.vo.RecruitmentEducationVO;

public interface RecruitmentEducationService {
	
	public List<RecruitmentEducationVO> queryRecruitmentEducation(RecruitmentEducationVO recruitmentEducationVO);
	
	public int addRecruitmentEducation(RecruitmentEducationVO recruitmentEducationVO);

	public int updateRecruitmentEducation(RecruitmentEducationVO recruitmentEducationVO);

	public int deleteRecruitmentEducation(RecruitmentEducationVO recruitmentEducationVO);

}
