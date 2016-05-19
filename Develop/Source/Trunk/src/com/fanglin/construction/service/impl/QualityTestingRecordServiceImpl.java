/**
 * @File Name		: QualityTestingRecordServiceImpl.java
 * @Package   	: com.fanglin.service.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-12-9
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.QualityTestingRecordDao;
import com.fanglin.construction.po.QualityTestingRecordPO;
import com.fanglin.construction.service.QualityTestingRecordService;
import com.fanglin.construction.vo.QualityTestingRecordVO;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("qualityTestingRecordService")
@Transactional(readOnly=true)
public class QualityTestingRecordServiceImpl implements QualityTestingRecordService {
	
	@Autowired
	private QualityTestingRecordDao qualityTestingRecordDao;

	@Override
	public void pageQualityTestingRecord(Paging paging, List<FilterVO> filters){
		
		List<QualityTestingRecordPO> qualityTestingRecordPOs = qualityTestingRecordDao.pageQualityTestingRecord(paging, filters);
		List<QualityTestingRecordVO> qualityTestingRecordVOs = new ArrayList<QualityTestingRecordVO>();
		
		for(QualityTestingRecordPO qualityTestingRecordPO: qualityTestingRecordPOs){
			QualityTestingRecordVO qualityTestingRecordVO = new QualityTestingRecordVO();
			BeanUtil.copyProperties(qualityTestingRecordPO, qualityTestingRecordVO);
			qualityTestingRecordVOs.add(qualityTestingRecordVO);
		}
		
		paging.setData(qualityTestingRecordVOs);
	}

	@Override
	public void pageQualityTestingRecordByOrderId(Paging paging, List<FilterVO> filters, QualityTestingRecordVO qualityTestingRecordVO, String operaterId){
		
		List<QualityTestingRecordPO> qualityTestingRecordPOs = qualityTestingRecordDao.pageQualityTestingRecordByOrderId(paging, filters, qualityTestingRecordVO.getOrderId(), operaterId);
		List<QualityTestingRecordVO> qualityTestingRecordVOs = new ArrayList<QualityTestingRecordVO>();
		
		for(QualityTestingRecordPO qualityTestingRecordPO: qualityTestingRecordPOs){
			QualityTestingRecordVO _qualityTestingRecordVO = new QualityTestingRecordVO();
			BeanUtil.copyProperties(qualityTestingRecordPO, _qualityTestingRecordVO);
			qualityTestingRecordVOs.add(_qualityTestingRecordVO);
		}
		
		paging.setData(qualityTestingRecordVOs);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addQualityTestingRecord(QualityTestingRecordVO qualityTestingRecordVO){

		QualityTestingRecordPO qualityTestingRecordPO = new QualityTestingRecordPO();
		BeanUtil.copyProperties(qualityTestingRecordVO, qualityTestingRecordPO);
		
		qualityTestingRecordDao.saveOrUpdate(qualityTestingRecordPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateQualityTestingRecord(QualityTestingRecordVO qualityTestingRecordVO){
		
		QualityTestingRecordPO qualityTestingRecordPO = qualityTestingRecordDao.get(qualityTestingRecordVO.getQtrId());
		
		if(qualityTestingRecordPO != null){
			BeanUtil.copyProperties(qualityTestingRecordVO, qualityTestingRecordPO);
			qualityTestingRecordDao.update(qualityTestingRecordPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteQualityTestingRecordById(int qtrId){
		qualityTestingRecordDao.deleteById(qtrId);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteQualityTestingRecord(QualityTestingRecordVO qualityTestingRecordVO){
		
		QualityTestingRecordPO qualityTestingRecordPO = qualityTestingRecordDao.get(qualityTestingRecordVO.getQtrId());
		
		if(qualityTestingRecordPO != null){
			qualityTestingRecordDao.delete(qualityTestingRecordPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteQualityTestingRecords(List<Integer> qtrIds){
		
		for(Integer qtrId: qtrIds){
			qualityTestingRecordDao.deleteById(qtrId);
		}
	}

}
