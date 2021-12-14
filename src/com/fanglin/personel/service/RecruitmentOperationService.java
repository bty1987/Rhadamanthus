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

import com.fanglin.personel.vo.RecruitmentOperationVO;

public interface RecruitmentOperationService {
	
	public List<RecruitmentOperationVO> queryRecruitmentOperation(RecruitmentOperationVO recruitmentOperationVO);
	
	public int addRecruitmentOperation(RecruitmentOperationVO recruitmentOperationVO);

	public int updateRecruitmentOperation(RecruitmentOperationVO recruitmentOperationVO);

	public int deleteRecruitmentOperation(RecruitmentOperationVO recruitmentOperationVO);
	

}
