package com.fanglin.payment.service.impl;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.dao.ProxyReceiptDao;
import com.fanglin.payment.po.ProxyReceiptPO;
import com.fanglin.payment.service.ProxyReceiptService;
import com.fanglin.payment.vo.ProxyReceiptVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;

@Service("proxyReceiptService")
@Transactional(readOnly = true)
public class ProxyReceiptServiceImpl implements ProxyReceiptService {

	@Autowired
	private ProxyReceiptDao proxyReceiptDao;

	@Override
	public ProxyReceiptVO queryProxyReceiptByPrId(ProxyReceiptVO proxyReceiptVO) throws FLException {

		ProxyReceiptPO proxyReceiptPO = proxyReceiptDao.get(proxyReceiptVO.getPrid());

		if (proxyReceiptPO == null) {
			throw new FLException(150026, "收据不存在");
		}

		BeanUtil.copyProperties(proxyReceiptPO, proxyReceiptVO, Arrays.asList("collecter", "confirmer"));

		UserPO collecterPO = proxyReceiptPO.getCollecter();

		if (collecterPO != null) {

			proxyReceiptVO.setCollecter(new UserBaseVO());

			BeanUtil.copyProperties(collecterPO, proxyReceiptVO.getCollecter(), Arrays.asList("duty", "dept"));

		}

		UserPO confirmPO = proxyReceiptPO.getConfirmer();

		if (confirmPO != null) {

			proxyReceiptVO.setConfirmer(new UserBaseVO());

			BeanUtil.copyProperties(confirmPO, proxyReceiptVO.getConfirmer(), Arrays.asList("duty", "dept"));

		}

		return proxyReceiptVO;

	}

}
