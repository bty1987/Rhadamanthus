package com.fanglin.kingdee.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.kingdee.dao.KingdeeRecordDao;
import com.fanglin.kingdee.po.KingdeeRecordPO;
import com.fanglin.kingdee.service.KingdeeRecordService;
import com.fanglin.kingdee.vo.KingdeeRecordVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("kingdeeRecordService")
@Transactional(readOnly = true)
public class KingdeeRecordServiceImpl implements KingdeeRecordService {
	
	@Autowired
	private KingdeeRecordDao kingdeeRecordDao;

	@Override
	public void pageKingdeeRecord(Paging paging, List<Filter> filters) {
		
		List<KingdeeRecordPO> kingdeeRecordPOs = kingdeeRecordDao.pageKingdeeRecord(paging, filters);
		List<KingdeeRecordVO> kingdeeRecordVOs = new ArrayList<KingdeeRecordVO>();
		
		for (KingdeeRecordPO kingdeeRecordPO : kingdeeRecordPOs) {
			
			KingdeeRecordVO kingdeeRecordVO = new KingdeeRecordVO();
			
			BeanUtil.copyProperties(kingdeeRecordPO, kingdeeRecordVO);
			
			kingdeeRecordVOs.add(kingdeeRecordVO);
			
		}
		
		paging.setData(kingdeeRecordVOs);
		
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addKingdeeRecord(KingdeeRecordVO kingdeeRecord) throws FLException {
		
		KingdeeRecordPO kingdeeRecordPO = new KingdeeRecordPO();
		
		BeanUtil.copyProperties(kingdeeRecord, kingdeeRecordPO);
		
		kingdeeRecordDao.save(kingdeeRecordPO);
		
	}

}
