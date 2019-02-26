package com.fanglin.information.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Authentication;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.AwardRecordDao;
import com.fanglin.information.po.AwardRecordPO;
import com.fanglin.information.service.AwardRecordService;
import com.fanglin.information.vo.AwardRecordVO;
import com.fanglin.information.vo.AwardStockVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("awardRecordService")
@Transactional(readOnly = true)
public class AwardRecordServiceImpl implements AwardRecordService {

	@Autowired
	private AwardRecordDao awardRecordDao;

	@Override
	public void pageAwardRecord(Paging paging, List<Filter> filters, Authentication authentication, AwardRecordVO awardRecord, int company) {

		if (awardRecord.getAwardStock().getAsId() != null) {
			filters.add(new Filter("awardStock", String.valueOf(awardRecord.getAwardStock().getAsId()), "eq"));
		}

		List<AwardRecordPO> AwardRecordPOs = awardRecordDao.pageAwardRecord(paging, filters, company);
		List<AwardRecordVO> awardRecordVOs = new ArrayList<AwardRecordVO>();

		AwardRecordVO awardRecordVO = null;

		for (AwardRecordPO awardRecordPO : AwardRecordPOs) {

			awardRecordVO = new AwardRecordVO(new AwardStockVO(), new UserVO());

			BeanUtil.copyProperties(awardRecordPO, awardRecordVO, Arrays.asList("creater", "awardStock"));
			BeanUtil.copyPropertie(awardRecordPO.getAwardStock(), awardRecordVO.getAwardStock());
			BeanUtil.copyProperties(awardRecordPO.getCreater(), awardRecordVO.getCreater(), Arrays.asList("dept", "role", "duty"));

			awardRecordVOs.add(awardRecordVO);
		}

		paging.setData(awardRecordVOs);
	}
	
}
