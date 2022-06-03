package com.fanglin.sales.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.dao.OalesDao;
import com.fanglin.sales.po.OalesPO;
import com.fanglin.sales.service.OalesService;
import com.fanglin.sales.vo.OalesVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("oalesService")
@Transactional(readOnly = true)
public class OalesServiceImpl implements OalesService {

	@Autowired
	private OalesDao oalesDao;

	@Autowired
	private BrandDao brandDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private CountingService countingService;

	@Override
	public void pageOales(Paging paging, List<Filter> filters, int company) throws FLException {

		List<OalesPO> oalesPOs = oalesDao.pageOales(paging, filters);
		List<OalesVO> oalesVOs = new ArrayList<OalesVO>();

		for (OalesPO oalesPO : oalesPOs) {

			OalesVO oalesVO = new OalesVO(new DecorationVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO());

			BeanUtil.copyProperties(oalesPO, oalesVO, Arrays.asList("decoration", "house", "customer", "supplier", "creater", "servicer", "checker", "materialer"));

			BeanUtil.copyProperties(oalesPO.getCreater(), oalesVO.getCreater(), Arrays.asList("dept", "duty"));
			BeanUtil.copyProperties(oalesPO.getSupplier(), oalesVO.getSupplier(), Arrays.asList("dept", "duty"));
			BeanUtil.copyProperties(oalesPO.getServicer(), oalesVO.getServicer(), Arrays.asList("dept", "duty"));
			BeanUtil.copyProperties(oalesPO.getChecker(), oalesVO.getChecker(), Arrays.asList("dept", "duty"));
			BeanUtil.copyProperties(oalesPO.getMaterialer(), oalesVO.getMaterialer(), Arrays.asList("dept", "duty"));

			oalesPO.getDecoration().ptvcascade(oalesVO.getDecoration());

			oalesVOs.add(oalesVO);
		}

		paging.setData(oalesVOs);
	}

	@Override
	public List<OalesVO> queryOalesByOrderId(OalesVO oalesVO) {

		List<OalesPO> oalesPOs = oalesDao.queryOalesByOrderId(oalesVO.getDecoration().getOrderId());
		List<OalesVO> oalesVOs = new ArrayList<OalesVO>();

		for (OalesPO oalesPO : oalesPOs) {

			oalesVO = new OalesVO(new DecorationVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO());

			BeanUtil.copyProperties(oalesPO, oalesVO, Arrays.asList("decoration", "house", "customer", "supplier", "creater", "servicer", "checker", "materialer"));

			BeanUtil.copyProperties(oalesPO.getCreater(), oalesVO.getCreater(), Arrays.asList("dept", "role", "duty"));
			BeanUtil.copyProperties(oalesPO.getSupplier(), oalesVO.getSupplier(), Arrays.asList("dept", "role", "duty"));
			BeanUtil.copyProperties(oalesPO.getServicer(), oalesVO.getServicer(), Arrays.asList("dept", "role", "duty"));
			BeanUtil.copyProperties(oalesPO.getChecker(), oalesVO.getChecker(), Arrays.asList("dept", "role", "duty"));
			BeanUtil.copyProperties(oalesPO.getMaterialer(), oalesVO.getMaterialer(), Arrays.asList("dept", "duty"));

			oalesVOs.add(oalesVO);
		}

		return oalesVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addOales(OalesVO oalesVO, String userId, int company) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(oalesVO.getDecoration().getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		CompanyPO companyPO = companyDao.get(company);

		UserPO creater = userDao.queryUserByUserId(userId);
		UserPO servicer = userDao.queryUserByUserId(oalesVO.getServicer().getUserId());
		UserPO materialer = userDao.queryUserByUserId(oalesVO.getMaterialer().getUserId());

		BrandPO brandPO = brandDao.get(oalesVO.getBid());

		String currentDate = DateUtil.current("yyMMdd").toString();

		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_OALES_INT, currentDate, company);
		String no = companyPO.getShortname() + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

		OalesPO oalesPO = new OalesPO();

		BeanUtil.copyProperties(oalesVO, oalesPO, Arrays.asList("decoration", "house", "customer", "supplier", "creater", "servicer", "checker", "materialer"));

		oalesPO.setNo(no);
		oalesPO.setCompany(company);

		oalesPO.setCreater(creater);
		oalesPO.setServicer(servicer);
		oalesPO.setSupplier(brandPO.getSupplier());

		oalesPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		oalesPO.setCategory(brandPO.getCategory().getName());
		oalesPO.setBrand(brandPO.getName());

		oalesPO.setDecoration(decorationPO);
		oalesPO.setCustomer(decorationPO.getCustomer());
		oalesPO.setHouse(decorationPO.getHouse());
		oalesPO.setMaterialer(materialer);
		oalesPO.setCost(oalesVO.getCost());
		oalesPO.setThreshold(oalesVO.getThreshold());

		oalesDao.save(oalesPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateOales(OalesVO oalesVO) throws FLException {

		OalesPO oalesPO = oalesDao.get(oalesVO.getOid());
		UserPO servicer = userDao.queryUserByUserId(oalesVO.getServicer().getUserId());

		UserPO materialer = userDao.queryUserByUserId(oalesVO.getMaterialer().getUserId());

		if (oalesPO == null) {
			throw new FLException(370021, "外销单不存在");
		}

		oalesPO.setTotal(oalesVO.getTotal());
		oalesPO.setAward(oalesVO.getAward());
		oalesPO.setAwardType(oalesVO.getAwardType());
		oalesPO.setProfit(oalesVO.getProfit());
		oalesPO.setCost(oalesVO.getCost());
		oalesPO.setThreshold(oalesVO.getThreshold());
		oalesPO.setComment(oalesVO.getComment());

		oalesPO.setServicer(servicer);
		oalesPO.setMaterialer(materialer);

		oalesDao.update(oalesPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void confirmOales(OalesVO oalesVO) throws FLException {

		OalesPO oalesPO = oalesDao.get(oalesVO.getOid());

		if (oalesPO == null) {
			throw new FLException(370021, "外销单不存在");
		}

		oalesPO.setStatus(OalesPO.STATUS_CONFIRM_INI);
		oalesPO.setConfirmTime(DateUtil.getDateToTimestamp(new Date()));

		oalesDao.update(oalesPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void rejectOales(OalesVO oalesVO, String userId) throws FLException {

		OalesPO oalesPO = oalesDao.get(oalesVO.getOid());

		UserPO checker = userDao.queryUserByUserId(userId);

		if (oalesPO == null) {
			throw new FLException(370021, "外销单不存在");
		}

		oalesPO.setStatus(OalesPO.STATUS_REJECT_INT);
		oalesPO.setChecker(checker);

		oalesDao.update(oalesPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void checkOales(OalesVO oalesVO) throws FLException {

		OalesPO oalesPO = oalesDao.get(oalesVO.getOid());

		if (oalesPO == null) {
			throw new FLException(370021, "外销单不存在");
		}

		oalesPO.setStatus(OalesPO.STATUS_CHECK_INT);
		oalesPO.setCheckTime(DateUtil.getDateToTimestamp(new Date()));

		oalesDao.update(oalesPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void finishOales(OalesVO oalesVO) throws FLException {

		OalesPO oalesPO = oalesDao.get(oalesVO.getOid());

		if (oalesPO == null) {
			throw new FLException(370021, "外销单不存在");
		}

		oalesPO.setStatus(OalesPO.STATUS_FINISH_INI);
		oalesPO.setFinishTime(DateUtil.getDateToTimestamp(new Date()));

		oalesDao.update(oalesPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteOales(OalesVO oalesVO) throws FLException {

		OalesPO oalesPO = oalesDao.get(oalesVO.getOid());

		oalesDao.delete(oalesPO);
	}

}
