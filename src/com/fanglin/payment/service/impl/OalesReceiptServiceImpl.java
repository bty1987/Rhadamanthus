package com.fanglin.payment.service.impl;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.payment.dao.OalesReceiptDao;
import com.fanglin.payment.po.OalesReceiptPO;
import com.fanglin.payment.service.OalesReceiptService;
import com.fanglin.payment.vo.OalesReceiptVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;

@Service("oalesReceiptService")
@Transactional(readOnly = true)
public class OalesReceiptServiceImpl implements OalesReceiptService {

	@Autowired
	private OalesReceiptDao oalesReceiptDao;

	@Override
	public OalesReceiptVO queryOalesReceiptByOrId(OalesReceiptVO oalesReceiptVO) {

		OalesReceiptPO oalesReceiptPO = oalesReceiptDao.queryOalesReceipt(oalesReceiptVO.getOrid());

		oalesReceiptVO = new OalesReceiptVO(new UserBaseVO(), new UserBaseVO());

		BeanUtil.copyProperties(oalesReceiptPO, oalesReceiptVO, Arrays.asList("collecter", "confirmer"));
		BeanUtil.copyProperties(oalesReceiptPO.getCollecter(), oalesReceiptVO.getCollecter(), Arrays.asList("dept", "duty"));
		BeanUtil.copyProperties(oalesReceiptPO.getConfirmer(), oalesReceiptVO.getConfirmer(), Arrays.asList("dept", "duty"));

		return oalesReceiptVO;
	}

}
