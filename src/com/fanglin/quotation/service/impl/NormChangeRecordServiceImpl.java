package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.quotation.dao.NormChangeRecordDao;
import com.fanglin.quotation.po.NormChangeRecordPO;
import com.fanglin.quotation.service.NormChangeRecordService;
import com.fanglin.quotation.vo.NormChangeRecordVO;
import com.fanglin.utils.Paging;

@Service("normChangeRecordService")
public class NormChangeRecordServiceImpl implements NormChangeRecordService {

	@Autowired
	private NormChangeRecordDao normChangeRecordDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void pageNormChangeRecord(Paging paging, NormChangeRecordVO condition) {

		List<NormChangeRecordPO> normChangeRecordPOs = normChangeRecordDao.pageNormChangeRecord(paging, condition);

		List<NormChangeRecordVO> normChangeRecordVOs = new ArrayList<NormChangeRecordVO>();

		for (NormChangeRecordPO normChangeRecordPO : normChangeRecordPOs) {
			normChangeRecordVOs.add(normChangeRecordPO.ptv(new NormChangeRecordVO()));
		}

		paging.setData(normChangeRecordVOs);
	}

}
