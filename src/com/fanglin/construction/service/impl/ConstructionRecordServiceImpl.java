/**
 * @File Name	: AcceptanceServiceImpl.java
 * @Package   	: com.fanglin.service.impl.constructionSchedule
 * @Version		: 1.0
 * @Date		: 2014-9-26
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
import com.fanglin.construction.dao.ConstructionRecordDao;
import com.fanglin.construction.po.ConstructionRecordPO;
import com.fanglin.construction.service.ConstructionRecordService;
import com.fanglin.construction.vo.ConstructionRecordVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.vo.UserBaseVO;

@Service("constructionRecordService")
@Transactional(readOnly = true)
public class ConstructionRecordServiceImpl implements ConstructionRecordService {

	@Autowired
	private ConstructionRecordDao constructionRecordDao;

	@Override
	public List<ConstructionRecordVO> queryConstructionRecordByOrderId(ConstructionRecordVO constructionRecordVO) throws FLException {

		List<ConstructionRecordPO> constructionRecordPOs = constructionRecordDao.queryConstructionRecordByOrderId(constructionRecordVO.getOrderId());
		List<ConstructionRecordVO> constructionRecordVOs = new ArrayList<ConstructionRecordVO>();

		for (ConstructionRecordPO constructionRecordPO : constructionRecordPOs) {
			constructionRecordVOs.add(constructionRecordPO.ptv(new ConstructionRecordVO(new UserBaseVO())));
		}

		return constructionRecordVOs;
	}

}