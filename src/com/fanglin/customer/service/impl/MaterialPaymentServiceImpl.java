package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.MaterialPaymentDao;
import com.fanglin.customer.service.MaterialPaymentService;
import com.fanglin.customer.vo.MaterialPaymentVO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.payment.po.MaterialPaymentPO;
import com.fanglin.payment.po.PaytranPO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.Paging;

@Service("materialPaymentOrderService")
@Transactional(readOnly = true)
public class MaterialPaymentServiceImpl implements MaterialPaymentService {

	@Autowired
	private MaterialPaymentDao materialPaymentDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	public void queryCusMaterialPayment(Paging paging, List<Filter> filters, MaterialPaymentVO materialPaymentVO) {

		String orderId = materialPaymentVO.getOrderId();
		String platform = "";

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		String grade = decorationPO.getGrade();
		int company = decorationPO.getCompany();

		SystemConfigPO systemConfigPO = systemConfigDao.querySystemConfig(String.format("PAYMENT_PLATFORM_WXPAY_PATH_%s_%s_STR", PaytranPO.ATTTYPE_MATERIAL_INT, grade), company);

		if (systemConfigPO == null) {
			systemConfigPO = systemConfigDao.querySystemConfig(String.format("PAYMENT_PLATFORM_WXPAY_PATH_%s_STR", grade), company);
		}

		if (systemConfigPO == null) {
			systemConfigPO = systemConfigDao.querySystemConfig("PAYMENT_PLATFORM_WXPAY_PATH_STR", company);
		}

		if (systemConfigPO == null) {
			systemConfigPO = systemConfigDao.querySystemConfig("PAYMENT_PLATFORM_PATH_STR", company);
		}

		if (systemConfigPO != null) platform = systemConfigPO.getValue();

		List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.queryCusMaterialByOrderId(paging, filters, orderId);
		List<MaterialPaymentVO> materialPaymentVOs = new ArrayList<MaterialPaymentVO>();

		if (materialPaymentPOs.size() != 0 && materialPaymentPOs != null) {

			for (MaterialPaymentPO materialPaymentPO : materialPaymentPOs) {

				materialPaymentVO = new MaterialPaymentVO();

				materialPaymentVO.setOrderId(materialPaymentPO.getMaterial().getOrderId());
				materialPaymentVO.setPaymentType(materialPaymentPO.getPaymentType());
				materialPaymentVO.setPaymentStatus(materialPaymentPO.getPaymentStatus());
				materialPaymentVO.setBrand(materialPaymentPO.getMaterial().getBrand());
				materialPaymentVO.setReferMoney(materialPaymentPO.getReferMoney());

				if (materialPaymentPO.getMaterialReceipt() != null) {
					materialPaymentVO.setCollectTime(materialPaymentPO.getMaterialReceipt().getCollectTime());
				}

				materialPaymentVO.setPlatform(platform);

				materialPaymentVOs.add(materialPaymentVO);
			}
		}

		paging.setData(materialPaymentVOs);
	}

	@Override
	public long countCusMaterialPaymentForAmount(MaterialPaymentVO materialPaymentVO) {

		long total = materialPaymentDao.amountCusMaterialPayment(materialPaymentVO.getOrderId());

		return total;
	}

}
