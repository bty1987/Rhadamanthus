package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.DecorationPaymentDao;
import com.fanglin.customer.service.DecorationPaymentService;
import com.fanglin.customer.vo.DecorationPaymentVO;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.utils.Paging;

@Service("decorationPaymentOrderService")
@Transactional(readOnly = true)
public class DecorationPaymentServiceImpl implements DecorationPaymentService {

	@Autowired
	private DecorationPaymentDao decorationPaymentDao;

	@Override
	public void queryCusDecorationPayment(Paging paging, List<Filter> filters, DecorationPaymentVO decorationPaymentVO) {

		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryCusDecorationPayment(paging, filters, decorationPaymentVO.getOrderId());
		List<DecorationPaymentVO> decorationPaymentVOs = new ArrayList<DecorationPaymentVO>();

		if (decorationPaymentPOs.size() != 0 && decorationPaymentPOs != null) {

			for (DecorationPaymentPO decorationPaymentPO : decorationPaymentPOs) {

				decorationPaymentVO = new DecorationPaymentVO();

				decorationPaymentVO.setOrderId(decorationPaymentVO.getOrderId());
				decorationPaymentVO.setReferMoney(decorationPaymentPO.getReferMoney());
				decorationPaymentVO.setPaymentStatus(decorationPaymentPO.getPaymentStatus());
				decorationPaymentVO.setPaymentType(decorationPaymentPO.getPaymentType());

				if (decorationPaymentPO.getDecorationReceipt() != null) {
					decorationPaymentVO.setCollectTime(decorationPaymentPO.getDecorationReceipt().getCollectTime());
				}

				decorationPaymentVOs.add(decorationPaymentVO);

			}
		}

		paging.setData(decorationPaymentVOs);
	}

	@Override
	public List<DecorationPaymentVO> queryCusDecorationPaymentForContract(DecorationPaymentVO decorationPaymentVO) {

		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryCusDecorationPaymentForContract(decorationPaymentVO.getOrderId());
		List<DecorationPaymentVO> decorationPaymentVOs = new ArrayList<DecorationPaymentVO>();

		if (decorationPaymentPOs != null && decorationPaymentPOs.size() != 0) {

			for (DecorationPaymentPO decorationPaymentPO : decorationPaymentPOs) {

				decorationPaymentVO = new DecorationPaymentVO();

				decorationPaymentVO.setOrderId(decorationPaymentVO.getOrderId());
				decorationPaymentVO.setReferMoney(decorationPaymentPO.getReferMoney());
				decorationPaymentVO.setPaymentStatus(decorationPaymentPO.getPaymentStatus());
				decorationPaymentVO.setPaymentType(decorationPaymentPO.getPaymentType());

				decorationPaymentVOs.add(decorationPaymentVO);
			}

		}

		return decorationPaymentVOs;
	}

}
