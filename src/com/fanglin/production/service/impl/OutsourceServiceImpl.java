package com.fanglin.production.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.production.dao.OutsourceDao;
import com.fanglin.production.dao.ProductionDao;
import com.fanglin.production.dao.TranpackDao;
import com.fanglin.production.po.OutsourcePO;
import com.fanglin.production.po.ProductionPO;
import com.fanglin.production.po.TranpackPO;
import com.fanglin.production.service.OutsourceService;
import com.fanglin.production.vo.OutsourceVO;
import com.fanglin.production.vo.ProductionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("outsourceService")
@Transactional(readOnly = true)
public class OutsourceServiceImpl implements OutsourceService {

	@Autowired
	private OutsourceDao outsourceDao;

	@Autowired
	private ProductionDao productionDao;

	@Autowired
	private TranpackDao tranpackDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private CountingService countingService;

	@Override
	public void pageOutsource(Paging paging, List<Filter> filter, int company) {

		List<OutsourcePO> outsourcePOs = outsourceDao.pageOutsource(paging, filter, company);
		List<OutsourceVO> outsourceVOs = new ArrayList<OutsourceVO>();

		for (OutsourcePO outsourcePO : outsourcePOs) {
			outsourceVOs.add(copyOutsourceVO(outsourcePO));
		}

		paging.setData(outsourceVOs);
	}

	@Override
	public void pageOutsourceForSupplier(Paging paging, List<Filter> filters, String userId, int company) {

		UserPO user = userDao.queryUserByUserId(userId);

		List<OutsourcePO> outsourcePOs = outsourceDao.pageOutsourceForSupplier(paging, filters, user.getUid(), company);
		List<OutsourceVO> outsourceVOs = new ArrayList<OutsourceVO>();

		for (OutsourcePO outsourcePO : outsourcePOs) {
			outsourceVOs.add(copyOutsourceVO(outsourcePO));
		}

		paging.setData(outsourceVOs);
	}

	@Override
	public List<OutsourceVO> queryOutsourceByPid(OutsourceVO outsourceVO, int company) {

		List<OutsourcePO> outsourcePOs = outsourceDao.queryOutsourceByPid(outsourceVO.getProduction().getPid(), company);
		List<OutsourceVO> outsourceVOs = new ArrayList<OutsourceVO>();

		for (OutsourcePO outsourcePO : outsourcePOs) {
			outsourceVOs.add(copyOutsourceVO(outsourcePO));
		}

		return outsourceVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addOutsource(OutsourceVO outsourceVO, String userId, int company) throws FLException {

		ProductionPO productionPO = productionDao.get(outsourceVO.getProduction().getPid());

		if (productionPO == null) {
			throw new FLException(220001, "生产单不存在");
		}

		if (productionPO.getStatus() != ProductionPO.STATUS_SPLIT_SHORT) {
			throw new FLException(220002, "生产单状态不可操作");
		}

		OutsourcePO outsourcePO = new OutsourcePO(new ProductionPO(), new UserPO(), new UserPO());

		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_PRODUCTION_LO_INT, currentDate, company);
		String no = "L" + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

		UserPO supplier = userDao.queryUserByUserId(outsourceVO.getSupplier().getUserId());

		if (supplier == null) {
			throw new FLException(190005, "厂商信息不存在");
		}

		BeanUtil.copyProperties(outsourceVO, outsourcePO, Arrays.asList("production", "creater", "supplier"));

		outsourcePO.setNo(no);
		outsourcePO.setCreater(userDao.queryUserByUserId(userId));
		outsourcePO.setSupplier(supplier);
		outsourcePO.setCompany(company);
		outsourcePO.setProduction(productionPO);
		outsourcePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		outsourceDao.save(outsourcePO);

		productionPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		productionDao.update(productionPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateOutsource(OutsourceVO outsourceVO) throws FLException {

		OutsourcePO outsourcePO = outsourceDao.get(outsourceVO.getOid());

		if (outsourcePO == null) {
			throw new FLException(220006, "外协单不存在");
		}

		if (outsourceVO.getTimeLimit() != null) {
			outsourcePO.setTimeLimit(outsourceVO.getTimeLimit());
		}

		if (outsourceVO.getComment() != null) {
			outsourcePO.setComment(outsourceVO.getComment());
		}

		if (outsourceVO.getPath() != null && !outsourceVO.getPath().equals("")) {
			outsourcePO.setPath(outsourceVO.getPath());
		}

		outsourceDao.update(outsourcePO);
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int receiptOutsource(OutsourceVO outsourceVO) throws FLException {

		OutsourcePO outsourcePO = outsourceDao.get(outsourceVO.getOid());

		if (outsourcePO == null) {
			throw new FLException(220006, "外协单不存在");
		}

		if (outsourcePO.getStatus() != OutsourcePO.STATUS_INIT_SHORT) {
			throw new FLException(220021, "外协单状态不可操作");
		}

		if (outsourcePO.getPath() == null || outsourcePO.getPath().equals("")) {
			throw new FLException(220021, "外协单状态不可操作");
		}

		outsourcePO.setStatus(OutsourcePO.STATUS_RECEIVE_SHORT);
		outsourcePO.getProduction().setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		outsourceDao.update(outsourcePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int confirmOutsource(OutsourceVO outsourceVO) throws FLException {

		OutsourcePO outsourcePO = outsourceDao.get(outsourceVO.getOid());

		if (outsourcePO == null) {
			throw new FLException(220006, "外协单不存在");
		}

		if (outsourcePO.getStatus() != OutsourcePO.STATUS_RECEIVE_SHORT) {
			throw new FLException(220021, "外协单状态不可操作");
		}

		outsourcePO.setStatus(outsourceVO.getStatus());
		outsourcePO.getProduction().setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		outsourceDao.update(outsourcePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int finishOutsource(OutsourceVO outsourceVO, String userId) throws FLException {

		OutsourcePO outsourcePO = outsourceDao.get(outsourceVO.getOid());

		if (outsourcePO == null) {
			throw new FLException(220006, "外协单不存在");
		}

		if (outsourcePO.getStatus() != OutsourcePO.STATUS_CONFIRM_SHORT) {
			throw new FLException(220021, "外协单状态不可操作");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		for (int i = 1; i <= outsourceVO.getNum(); i++) {

			TranpackPO tranpackPO = new TranpackPO(new ProductionPO(), new UserPO());

			String no = outsourcePO.getNo() + "-" + i;

			tranpackPO.setNo(no);
			tranpackPO.setRid(outsourcePO.getOid());
			tranpackPO.setProduction(outsourcePO.getProduction());
			tranpackPO.setCreater(creater);
			tranpackPO.setType(TranpackPO.TYPE_OUTSOURCE_INT);
			tranpackPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

			tranpackDao.save(tranpackPO);
		}

		outsourcePO.setStatus(outsourceVO.getStatus());
		outsourcePO.setFinishTime(DateUtil.getDateToTimestamp(new Date()));
		outsourcePO.getProduction().setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		outsourceDao.update(outsourcePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteOutsource(OutsourceVO outsourceVO) throws FLException {

		OutsourcePO outsourcePO = outsourceDao.get(outsourceVO.getOid());

		if (outsourcePO == null) {
			throw new FLException(220006, "外协单不存在");
		}

		if (outsourcePO.getStatus() != OutsourcePO.STATUS_INIT_SHORT) {
			throw new FLException(220021, "外协单状态不可操作");
		}

		outsourcePO.setStatus(outsourceVO.getStatus());
		outsourceDao.update(outsourcePO);

		return 0;
	}

	// copy赋值
	private OutsourceVO copyOutsourceVO(OutsourcePO outsourcePO) {

		OutsourceVO outsourceVO = new OutsourceVO(new ProductionVO(new HouseVO(new VillageVO()), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO()), new UserBaseVO(), new UserBaseVO());

		BeanUtil.copyProperties(outsourcePO, outsourceVO, Arrays.asList("production", "creater", "supplier"));
		BeanUtil.copyProperties(outsourcePO.getProduction(), outsourceVO.getProduction(), Arrays.asList("house", "creater", "brand", "salesman", "designer", "spliter"));
		BeanUtil.copyProperties(outsourcePO.getProduction().getHouse(), outsourceVO.getProduction().getHouse(), Arrays.asList("village"));
		BeanUtil.copyProperties(outsourcePO.getProduction().getHouse().getVillage(), outsourceVO.getProduction().getHouse().getVillage(), Arrays.asList("cityProper"));
		BeanUtil.copyProperties(outsourcePO.getCreater(), outsourceVO.getCreater(), Arrays.asList("duty", "dept"));
		BeanUtil.copyProperties(outsourcePO.getSupplier(), outsourceVO.getSupplier(), Arrays.asList("duty", "dept"));
		BeanUtil.copyProperties(outsourcePO.getProduction().getCreater(), outsourceVO.getProduction().getCreater(), Arrays.asList("duty", "dept"));
		BeanUtil.copyProperties(outsourcePO.getProduction().getSalesman(), outsourceVO.getProduction().getSalesman(), Arrays.asList("duty", "dept"));
		BeanUtil.copyProperties(outsourcePO.getProduction().getDesigner(), outsourceVO.getProduction().getDesigner(), Arrays.asList("duty", "dept"));
		BeanUtil.copyProperties(outsourcePO.getProduction().getSpliter(), outsourceVO.getProduction().getSpliter(), Arrays.asList("duty", "dept"));

		return outsourceVO;
	}

}
