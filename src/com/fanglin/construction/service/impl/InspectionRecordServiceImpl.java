/**
 * @File Name	: InspectionRecordServiceImpl.java
 * @Package   	: com.fanglin.service.impl.constructionSchedule
 * @Version		: 1.0
 * @Date		: 2014-9-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.InspectionRecordDao;
import com.fanglin.construction.po.InspectionRecordPO;
import com.fanglin.construction.service.InspectionRecordService;
import com.fanglin.construction.vo.InspectionRecordVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("inspectionRecordService")
@Transactional(readOnly=true)
public class InspectionRecordServiceImpl implements InspectionRecordService {
	
	@Autowired
	private InspectionRecordDao inspectionRecordDao;
	
	@Autowired
	private UserDao userDao;
	
	@Override
	public void pageInspectionRecord(Paging paging, List<Filter> filters){
		
		List<InspectionRecordPO> inspectionRecordPOs = inspectionRecordDao.pageInspectionRecord(paging, filters);
		List<InspectionRecordVO> inspectionRecordVOs = new ArrayList<InspectionRecordVO>();
		
		for(InspectionRecordPO inspectionRecordPO: inspectionRecordPOs){
			InspectionRecordVO inspectionRecordVO = new InspectionRecordVO();
			BeanUtil.copyProperties(inspectionRecordPO, inspectionRecordVO);
			inspectionRecordVOs.add(inspectionRecordVO);
		}
		
		paging.setData(inspectionRecordVOs);
	}

	@Override
	public void pageInspectionRecordByOrderId(Paging paging, List<Filter> filters, InspectionRecordVO inspectionRecordVO){
		
		List<InspectionRecordPO> inspectionRecordPOs = inspectionRecordDao.pageInspectionRecordByOrderId(paging, filters, inspectionRecordVO.getOrderId());
		List<InspectionRecordVO> inspectionRecordVOs = new ArrayList<InspectionRecordVO>();
		
		for(InspectionRecordPO inspectionRecordPO: inspectionRecordPOs){
			InspectionRecordVO _inspectionRecordVO = new InspectionRecordVO();
			BeanUtil.copyProperties(inspectionRecordPO, _inspectionRecordVO);
			inspectionRecordVOs.add(_inspectionRecordVO);
		}
		
		paging.setData(inspectionRecordVOs);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void saveOrUpdateInspectionRecord(InspectionRecordVO inspectionRecordVO){
		
		InspectionRecordPO inspectionRecordPO = new InspectionRecordPO();
		BeanUtil.copyProperties(inspectionRecordVO, inspectionRecordPO);
		
		UserPO user = userDao.queryUserByUserId(inspectionRecordVO.getOperaterId());
		inspectionRecordPO.setOuid(user.getUid());
		
		inspectionRecordDao.saveOrUpdate(inspectionRecordPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateInspectionRecord(InspectionRecordVO inspectionRecordVO){
		
		InspectionRecordPO inspectionRecordPO = inspectionRecordDao.get(inspectionRecordVO.getIrId());
		BeanUtil.copyProperties(inspectionRecordVO, inspectionRecordPO);
		
		inspectionRecordDao.saveOrUpdate(inspectionRecordPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteInspectionRecordById(int irId, String userId){
		
		InspectionRecordPO inspectionRecordPO = inspectionRecordDao.get(irId);
		
		UserPO user = userDao.get(inspectionRecordPO.getOuid());
		String _userId = user.getUserId();
		
		inspectionRecordPO.setOuid(user.getUid());
		
		if(inspectionRecordPO != null && _userId.equals(userId)){
			inspectionRecordDao.delete(inspectionRecordPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteInspectionRecords(List<String> irIds, String userId){
		
		for(String irId: irIds){
			InspectionRecordPO inspectionRecordPO = inspectionRecordDao.get(Integer.valueOf(irId));
			
			UserPO user = userDao.get(inspectionRecordPO.getOuid());
			String _userId = user.getUserId();
			
			if(inspectionRecordPO != null && _userId.equals(userId)){
				inspectionRecordDao.delete(inspectionRecordPO);
			}
		}
	}
}

