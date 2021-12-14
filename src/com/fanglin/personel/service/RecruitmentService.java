package com.fanglin.personel.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.vo.RecruitmentEducationVO;
import com.fanglin.personel.vo.RecruitmentOperationVO;
import com.fanglin.personel.vo.RecruitmentVO;
import com.fanglin.utils.Paging;

public interface RecruitmentService {
	
	public void pageRecruitment(Paging paging, List<Filter> filters);
	
	public void addRecruitment(RecruitmentVO recruitmentVO, List<RecruitmentEducationVO> recruitmentEducationVOs, List<RecruitmentOperationVO> recruitmentOperationVOs)throws FLException;

	public RecruitmentVO queryRecruitmentByRid(RecruitmentVO recruitmentVO) throws FLException;

	public void updateRecruitment(RecruitmentVO recruitmentVO) throws FLException;

	
}
