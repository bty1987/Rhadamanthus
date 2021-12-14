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

import com.fanglin.personel.dao.RecruitmentOperationDao;
import com.fanglin.personel.po.RecruitmentOperationPO;
import com.fanglin.personel.service.RecruitmentOperationService;
import com.fanglin.personel.vo.RecruitmentOperationVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("recruitmentOperationService")
@Transactional(readOnly = true)
public class RecruitmentOperationServiceImpl implements RecruitmentOperationService {

	@Autowired
	private RecruitmentOperationDao recruitmentOperationDao;

	@Override
	public List<RecruitmentOperationVO> queryRecruitmentOperation(RecruitmentOperationVO recruitmentOperationVO) {
		
		List<RecruitmentOperationPO> recruitmentOperationPOs = recruitmentOperationDao.queryRecruitmentOperation(recruitmentOperationVO.getRid());
		List<RecruitmentOperationVO> recruitmentOperationVOs = new ArrayList<RecruitmentOperationVO>();
		
		for (RecruitmentOperationPO recruitmentOperationPO : recruitmentOperationPOs) {
			
			recruitmentOperationVO = new RecruitmentOperationVO();
			
			BeanUtil.copyPropertie(recruitmentOperationPO, recruitmentOperationVO);
			
			recruitmentOperationVOs.add(recruitmentOperationVO);
		}
		
		return recruitmentOperationVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addRecruitmentOperation(RecruitmentOperationVO recruitmentOperationVO) {
		
		RecruitmentOperationPO recruitmentOperationPO = new RecruitmentOperationPO();
		
		BeanUtil.copyPropertie(recruitmentOperationVO, recruitmentOperationPO);
		
		recruitmentOperationPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		recruitmentOperationDao.save(recruitmentOperationPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateRecruitmentOperation(RecruitmentOperationVO recruitmentOperationVO) {
		
		RecruitmentOperationPO recruitmentOperationPO = recruitmentOperationDao.get(recruitmentOperationVO.getRoid());
		
		BeanUtil.copyPropertie(recruitmentOperationVO, recruitmentOperationPO);
		
		recruitmentOperationDao.update(recruitmentOperationPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteRecruitmentOperation(RecruitmentOperationVO recruitmentOperationVO) {
		
		recruitmentOperationDao.deleteById(recruitmentOperationVO.getRoid());
		
		return 0;
	}
}
