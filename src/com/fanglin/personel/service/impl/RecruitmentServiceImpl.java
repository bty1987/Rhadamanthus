package com.fanglin.personel.service.impl;


import java.util.ArrayList;
import java.util.Date;


import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.RecruitmentDao;
import com.fanglin.personel.dao.RecruitmentEducationDao;
import com.fanglin.personel.dao.RecruitmentOperationDao;
import com.fanglin.personel.po.RecruitmentEducationPO;
import com.fanglin.personel.po.RecruitmentOperationPO;
import com.fanglin.personel.po.RecruitmentPO;
import com.fanglin.personel.service.RecruitmentService;
import com.fanglin.personel.vo.RecruitmentEducationVO;
import com.fanglin.personel.vo.RecruitmentOperationVO;
import com.fanglin.personel.vo.RecruitmentVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;


import com.fanglin.utils.Paging;

@Service("RecruitmentService")
@Transactional(readOnly = true)
public class RecruitmentServiceImpl implements RecruitmentService{
	
	@Autowired
	private RecruitmentDao recruitmentDao;
	
	@Autowired
	private RecruitmentEducationDao recruitmentEducationDao;
	
	@Autowired
	private RecruitmentOperationDao recruitmentOperationDao;

	@Override
	public void pageRecruitment(Paging paging, List<Filter> filters) {
		
		List<RecruitmentPO> RecruitmentPOs = recruitmentDao.pageRecruitment(paging, filters);
		List<RecruitmentVO> RecruitmentVOs = new ArrayList<RecruitmentVO>();
		for (RecruitmentPO recruitmentPO : RecruitmentPOs) {
			
			RecruitmentVO recruitmentVO = new RecruitmentVO();
			
			BeanUtil.copyPropertie(recruitmentPO, recruitmentVO);
			
			RecruitmentVOs.add(recruitmentVO);
		}
		
		paging.setData(RecruitmentVOs);
	
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addRecruitment(RecruitmentVO recruitmentVO,List<RecruitmentEducationVO> recruitmentEducationVOs, List<RecruitmentOperationVO> recruitmentOperationVOs)throws FLException{
		
		RecruitmentPO recruitmentPO = new RecruitmentPO();
		
		BeanUtil.copyPropertie(recruitmentVO, recruitmentPO);
		
		recruitmentDao.save(recruitmentPO);
		
		if (recruitmentEducationVOs != null && recruitmentEducationVOs.size() != 0) {
			for (RecruitmentEducationVO recruitmentEducationVO : recruitmentEducationVOs) {
				
				RecruitmentEducationPO recruitmentEducationPO = new RecruitmentEducationPO();
				
				BeanUtil.copyPropertie(recruitmentEducationVO, recruitmentEducationPO);
				recruitmentEducationPO.setRid(recruitmentPO.getRid());
				recruitmentEducationPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
				recruitmentEducationDao.save(recruitmentEducationPO);
			}
		}

		if (recruitmentOperationVOs != null && recruitmentOperationVOs.size() != 0) {
			for (RecruitmentOperationVO recruitmentOperationVO : recruitmentOperationVOs) {
				
				RecruitmentOperationPO recruitmentOperationPO = new RecruitmentOperationPO();

				BeanUtil.copyPropertie(recruitmentOperationVO, recruitmentOperationPO);
				recruitmentOperationPO.setRid(recruitmentPO.getRid());
				recruitmentOperationPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
				recruitmentOperationDao.save(recruitmentOperationPO);
			}
		}
		
	}

	@Override
	public RecruitmentVO queryRecruitmentByRid(RecruitmentVO recruitmentVO) throws FLException {
		
		RecruitmentPO recruitmentPO = recruitmentDao.queryRecruitmentByRid(recruitmentVO.getRid());

		BeanUtil.copyProperties(recruitmentPO, recruitmentVO);

		return recruitmentVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateRecruitment(RecruitmentVO recruitmentVO) throws FLException {
		
		RecruitmentPO recruitmentPO = recruitmentDao.get(recruitmentVO.getRid());
		
		BeanUtil.copyPropertie(recruitmentVO, recruitmentPO);
		
		recruitmentDao.update(recruitmentPO);

	}
}
