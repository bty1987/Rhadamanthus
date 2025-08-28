package com.fanglin.sales.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.payment.dao.OalesPaymentDao;
import com.fanglin.payment.po.OalesPaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.dao.OalesDao;
import com.fanglin.sales.dao.OalesPayDao;
import com.fanglin.sales.po.OalesPO;
import com.fanglin.sales.po.OalesPayOO;
import com.fanglin.sales.po.OalesPayPO;
import com.fanglin.sales.service.OalesPayService;
import com.fanglin.sales.vo.OalesPayVO;
import com.fanglin.sales.vo.OalesVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("oalesPayService")
@Transactional(readOnly = true)
public class OalesPayServiceImpl implements OalesPayService {

	@Autowired
	private OalesPayDao oalesPayDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private OalesDao oalesDao;

	@Autowired
	private OalesPaymentDao oalesPaymentDao;

	@Override
	public void pageOalesPay(Paging paging, List<Filter> filters, int company) throws FLException {

		List<OalesPayOO> oalesPayOOs = oalesPayDao.pageOalesPay(paging, filters, company);
		List<OalesPayVO> oalesPayVOs = new ArrayList<OalesPayVO>();

		for (OalesPayOO oalesPayOO : oalesPayOOs) {

			OalesPayVO oalesPayVO = new OalesPayVO(new UserBaseVO(), new OalesVO(new DecorationVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO()));

			BeanUtil.copyProperties(oalesPayOO, oalesPayVO, Arrays.asList("oales", "creater"));
			BeanUtil.copyProperties(oalesPayOO.getCreater(), oalesPayVO.getCreater(), Arrays.asList("dept", "duty"));

			oalesPayOO.getOales().ptv(oalesPayVO.getOales());

			oalesPayVOs.add(oalesPayVO);
		}

		paging.setData(oalesPayVOs);
	}

	@Override
	public List<OalesPayVO> queryOalesPay(OalesPayVO oalesPayVO) {

		List<OalesPayVO> oalesPayVOs = new ArrayList<OalesPayVO>();

		List<OalesPayPO> oalesPayPOs = oalesPayDao.queryOalesPay(oalesPayVO);

		for (OalesPayPO oalesPayPO : oalesPayPOs) {

			oalesPayVO = new OalesPayVO(new UserBaseVO(), new OalesVO());

			BeanUtil.copyProperties(oalesPayPO, oalesPayVO, Arrays.asList("creater"));
			BeanUtil.copyProperties(oalesPayPO.getCreater(), oalesPayVO.getCreater(), Arrays.asList("dept", "duty"));

			oalesPayVOs.add(oalesPayVO);
		}

		return oalesPayVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addOalesPay(OalesPayVO oalesPayVO, String userId, int company) throws FLException {

		OalesPO oales = oalesDao.get(oalesPayVO.getOid());

		if (oales == null) {
			throw new FLException(370021, "外销单不存在");
		}

		if (oalesPayVO.getMoney() < 0) {
			throw new FLException(150025, "款项金额不正确");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		OalesPayPO oalesPayPO = new OalesPayPO();

		BeanUtil.copyProperties(oalesPayVO, oalesPayPO, Arrays.asList("creater"));

		oalesPayPO.setCreater(creater);
		oalesPayPO.setCompany(company);
		oalesPayPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		oalesPayDao.save(oalesPayPO);

		OalesPaymentPO oalesPaymentPO = new OalesPaymentPO(new UserPO(), new OalesPO());

		oalesPaymentPO.setOales(oales);
		oalesPaymentPO.setOrderId(oales.getDecoration().getOrderId());
		oalesPaymentPO.setType(OalesPaymentPO.TYPE_PAYMENT_INT);
		oalesPaymentPO.setStatus(OalesPaymentPO.STATUS_INITIAL_INT);
		oalesPaymentPO.setCategory(oales.getCategory());
		oalesPaymentPO.setBrand(oales.getBrand());
		oalesPaymentPO.setReferMoney(oalesPayVO.getMoney());
		oalesPaymentPO.setCreater(creater);
		oalesPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		oalesPaymentPO.setCompany(company);

		oalesPaymentDao.save(oalesPaymentPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateOalesPay(OalesPayVO oalesPayVO) throws FLException {

		OalesPayPO oalesPayPO = oalesPayDao.get(oalesPayVO.getOpid());

		BeanUtil.copyProperties(oalesPayVO, oalesPayPO, Arrays.asList("creater"));

		oalesPayDao.update(oalesPayPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateOalesPayForAdvance(OalesPayVO oalesPayVO) throws FLException {

		OalesPayPO oalesPayPO = oalesPayDao.get(oalesPayVO.getOpid());

		if (oalesPayPO == null) {
			throw new FLException(000000, "销售付款不存在");
		}

		oalesPayPO.setCreateTime(oalesPayVO.getCreateTime());

		oalesPayDao.update(oalesPayPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteOalesPay(OalesPayVO oalesPayVO) throws FLException {

		OalesPayPO oalesPayPO = oalesPayDao.get(oalesPayVO.getOpid());

		oalesPayDao.delete(oalesPayPO);

		return 0;
	}

}
