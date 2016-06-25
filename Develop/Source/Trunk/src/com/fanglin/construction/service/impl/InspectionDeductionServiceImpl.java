/**
 * @File Name		: InspectionDeductionServiceImpl.java
 * @Package   	: com.fanglin.service.impl.constructionSchedule
 * @Version		: 1.0
 * @Date			: 2014-9-25
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

import com.fanglin.construction.dao.InspectionDeductionDao;
import com.fanglin.construction.po.InspectionDeductionPO;
import com.fanglin.construction.service.InspectionDeductionService;
import com.fanglin.construction.vo.InspectionDeductionVO;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("inspectionDeductionService")
@Transactional(readOnly=true)
public class InspectionDeductionServiceImpl implements InspectionDeductionService {
	
	@Autowired
	private InspectionDeductionDao inspectionDeductionDao;

	@Override
	public void pageInspectionDeduction(Paging paging, List<FilterVO> filters){
		
		List<InspectionDeductionPO> inspectionDeductionPOs = inspectionDeductionDao.pageInspectionDeduction(paging, filters);
		List<InspectionDeductionVO> inspectionDeductionVOs = new ArrayList<InspectionDeductionVO>();
		
		for(InspectionDeductionPO inspectionDeductionPO: inspectionDeductionPOs){
			InspectionDeductionVO inspectionDeductionVO = new InspectionDeductionVO();
			BeanUtil.copyProperties(inspectionDeductionPO, inspectionDeductionVO);
			inspectionDeductionVOs.add(inspectionDeductionVO);
		}
		
		paging.setData(inspectionDeductionVOs);
	}

	@Override
	public void pageInspectionDeductionByOrderId(Paging paging, List<FilterVO> filters, InspectionDeductionVO inspectionDeductionVO){

		List<InspectionDeductionPO> inspectionDeductionPOs = inspectionDeductionDao.pageInspectionDeductionByOrderId(paging, filters, inspectionDeductionVO.getOrderId());
		List<InspectionDeductionVO> inspectionDeductionVOs = new ArrayList<InspectionDeductionVO>();
		
		for(InspectionDeductionPO inspectionDeductionPO: inspectionDeductionPOs){
			InspectionDeductionVO _inspectionDeductionVO = new InspectionDeductionVO();
			BeanUtil.copyProperties(inspectionDeductionPO, _inspectionDeductionVO);
			inspectionDeductionVOs.add(_inspectionDeductionVO);
		}
		
		paging.setData(inspectionDeductionVOs);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void saveOrUpdateInspectionDeduction(InspectionDeductionVO inspectionDeductionVO){
		
		InspectionDeductionPO inspectionDeductionPO = new InspectionDeductionPO();
		BeanUtil.copyProperties(inspectionDeductionVO, inspectionDeductionPO);
		inspectionDeductionDao.saveOrUpdate(inspectionDeductionPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateInspectionDeduction(InspectionDeductionVO inspectionDeductionVO){
		
		InspectionDeductionPO inspectionDeductionPO = inspectionDeductionDao.get(inspectionDeductionVO.getIdId());
		BeanUtil.copyProperties(inspectionDeductionVO, inspectionDeductionPO);
		inspectionDeductionDao.update(inspectionDeductionPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteInspectionDeductionById(int idId){
		
		inspectionDeductionDao.deleteById(idId);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteInspectionDeduction(InspectionDeductionVO inspectionDeductionVO){
		
		InspectionDeductionPO inspectionDeductionPO = new InspectionDeductionPO();
		BeanUtil.copyProperties(inspectionDeductionVO, inspectionDeductionPO);
		inspectionDeductionDao.delete(inspectionDeductionPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteInspectionRecords(List<String> idIds){
		
		for(String idId: idIds){
			InspectionDeductionPO inspectionDeductionPO = inspectionDeductionDao.get(Integer.valueOf(idId));
			if(inspectionDeductionPO != null){
				inspectionDeductionDao.delete(inspectionDeductionPO);
			}
		}
	}

}
