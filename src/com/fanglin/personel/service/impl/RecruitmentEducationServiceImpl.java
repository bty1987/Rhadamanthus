/**
 * Title: UserContractServiceImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.personel.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.personel.dao.RecruitmentEducationDao;
import com.fanglin.personel.po.RecruitmentEducationPO;
import com.fanglin.personel.service.RecruitmentEducationService;
import com.fanglin.personel.vo.RecruitmentEducationVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("recruitmentEducationService")
@Transactional(readOnly = true)
public class RecruitmentEducationServiceImpl implements RecruitmentEducationService {

	@Autowired
	private RecruitmentEducationDao recruitmentEducationDao;

	@Override
	public List<RecruitmentEducationVO> queryRecruitmentEducation(RecruitmentEducationVO recruitmentEducationVO) {
		
		List<RecruitmentEducationPO> recruitmentEducationPOs = recruitmentEducationDao.queryRecruitmentEducation(recruitmentEducationVO.getRid());
		List<RecruitmentEducationVO> recruitmentEducationVOs = new ArrayList<RecruitmentEducationVO>();
		
		for (RecruitmentEducationPO recruitmentEducationPO : recruitmentEducationPOs) {
			
			recruitmentEducationVO = new RecruitmentEducationVO();
			
			BeanUtil.copyPropertie(recruitmentEducationPO, recruitmentEducationVO);
			
			recruitmentEducationVOs.add(recruitmentEducationVO);
		}
		return recruitmentEducationVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addRecruitmentEducation(RecruitmentEducationVO recruitmentEducationVO) {
		
		RecruitmentEducationPO recruitmentEducationPO = new RecruitmentEducationPO();
		
		BeanUtil.copyPropertie(recruitmentEducationVO, recruitmentEducationPO);
		
		recruitmentEducationPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		recruitmentEducationDao.save(recruitmentEducationPO);
		
		recruitmentEducationVO.setReid(recruitmentEducationPO.getReid());
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateRecruitmentEducation(RecruitmentEducationVO recruitmentEducationVO) {
		
		RecruitmentEducationPO recruitmentEducationPO = recruitmentEducationDao.get(recruitmentEducationVO.getReid());
		
		BeanUtil.copyPropertie(recruitmentEducationVO, recruitmentEducationPO);
		
		recruitmentEducationDao.update(recruitmentEducationPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteRecruitmentEducation(RecruitmentEducationVO recruitmentEducationVO) {
		
		recruitmentEducationDao.deleteById(recruitmentEducationVO.getReid());
		
		return 0;
	}

}
