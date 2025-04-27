package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.quotation.dao.QuotationRecordDao;
import com.fanglin.quotation.po.QuotationRecordPO;
import com.fanglin.quotation.service.QuotationRecordService;
import com.fanglin.quotation.vo.QuotationRecordVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("quotationRecordService")
@Transactional(readOnly = true)
public class QuotationRecordServiceImpl implements QuotationRecordService{

	@Autowired
	private QuotationRecordDao quotationRecordDao;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageQuotationRecord(Paging paging, List<Filter> filters, QuotationRecordVO quotationRecord) {

		List<QuotationRecordPO> quotationRecordPOs = quotationRecordDao.pageQuotationRecord(paging, filters, quotationRecord.getType(), quotationRecord.getQid());
		List<QuotationRecordVO> quotationRecordVOs = new ArrayList<QuotationRecordVO>();

		for (QuotationRecordPO quotationRecordPO : quotationRecordPOs) {

			quotationRecord = new QuotationRecordVO(new UserBaseVO());

			BeanUtil.copyProperties(quotationRecordPO, quotationRecord, Arrays.asList("operater"));
			BeanUtil.copyProperties(quotationRecordPO.getOperater(), quotationRecord.getOperater(), Arrays.asList("duty", "dept", "role"));

			quotationRecordVOs.add(quotationRecord);
		}

		paging.setData(quotationRecordVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addQuotationRecord(QuotationRecordVO quotationRecordVO, String userId) {

		QuotationRecordPO quotationRecordPO = new QuotationRecordPO();

		BeanUtil.copyProperties(quotationRecordVO, quotationRecordPO, Arrays.asList("operater"));

		quotationRecordPO.setOperater(userDao.queryUserByUserId(userId));
		quotationRecordPO.setOperatTime(DateUtil.getDateToTimestamp(new Date()));

		quotationRecordDao.save(quotationRecordPO);

		return 0;
	}

}
