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
import com.fanglin.communion.po.HousePO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.production.dao.HardwareDao;
import com.fanglin.production.dao.HardwareItemDao;
import com.fanglin.production.dao.ProductionDao;
import com.fanglin.production.dao.TranpackDao;
import com.fanglin.production.po.HardwarePO;
import com.fanglin.production.po.ProductionPO;
import com.fanglin.production.po.TranpackPO;
import com.fanglin.production.service.HardwareService;
import com.fanglin.production.vo.HardwareVO;
import com.fanglin.production.vo.ProductionVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("hardwareService")
@Transactional(readOnly = true)
public class HardwareServiceImpl implements HardwareService {

	@Autowired
	private HardwareDao hardwareDao;

	@Autowired
	private HardwareItemDao hardwareItemDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private ProductionDao productionDao;

	@Autowired
	private CountingService countingService;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private TranpackDao tranpackDao;

	@Override
	public void pageHardware(Paging paging, List<Filter> filters, int company) {

		List<HardwarePO> hardwarePOs = hardwareDao.pageHardware(paging, filters, company);
		List<HardwareVO> hardwareVOs = new ArrayList<HardwareVO>();

		for (HardwarePO hardwarePO : hardwarePOs) {
			hardwareVOs.add(copyHardwarePO(hardwarePO));
		}

		paging.setData(hardwareVOs);
	}

	@Override
	public List<HardwareVO> queryHardwareByPid(HardwareVO hardwareVo) {
		List<HardwarePO> hardwarePOs = hardwareDao.queryHardwareByPid(hardwareVo.getProduction().getPid());
		List<HardwareVO> hardwareVOs = new ArrayList<HardwareVO>();

		for (HardwarePO hardwarePO : hardwarePOs) {
			hardwareVOs.add(copyHardwarePO(hardwarePO));
		}

		return hardwareVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addHardware(HardwareVO hardwareVO, String userId, int company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		ProductionPO productionPO = productionDao.get(hardwareVO.getProduction().getPid());

		if (productionPO == null) {
			throw new FLException(220001, "生产单不存在");
		}

		if (productionPO.getStatus() != ProductionPO.STATUS_CONFIRM_SHORT) {
			throw new FLException(220002, "生产单状态不可操作");
		}

		HardwarePO hardwarePO = new HardwarePO(new ProductionPO(new HousePO(), new UserPO(), new UserPO(), new UserPO(), new UserPO()), new UserPO());

		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_PRODUCTION_GO_INT, currentDate, company);
		String no = companyPO.getShortname() + "G" + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

		UserPO creater = userDao.queryUserByUserId(userId);

		BeanUtil.copyProperties(hardwareVO, hardwarePO, Arrays.asList("production", "creater"));
		BeanUtil.copyProperties(hardwareVO.getProduction(), hardwarePO.getProduction(), Arrays.asList("house", "creater", "brand", "salesman", "designer", "spliter"));

		hardwarePO.setCreater(creater);
		hardwarePO.setCompany(company);
		hardwarePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		hardwarePO.setNo(no);
		hardwareDao.save(hardwarePO);

		productionPO.setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		productionDao.update(productionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateHardware(HardwareVO hardwareVO) throws FLException {

		HardwarePO hardwarePO = hardwareDao.get(hardwareVO.getHid());

		if (hardwarePO == null) {
			throw new FLException(220004, "五金单不存在");
		}

		if (hardwareVO.getComment() != null) {
			hardwarePO.setComment(hardwareVO.getComment());
		}

		if (hardwareVO.getPath() != null && !hardwareVO.getPath().equals("")) {
			hardwarePO.setPath(hardwareVO.getPath());
		}

		hardwarePO.getProduction().setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		hardwareDao.update(hardwarePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int instoreHardware(HardwareVO hardwareVO) throws FLException {
		HardwarePO hardwarePO = hardwareDao.get(hardwareVO.getHid());

		if (hardwarePO == null) {
			throw new FLException(220004, "五金单不存在");
		}

		if (hardwarePO.getStatus() != HardwarePO.STATUS_PURCHASE_SHORT) {
			throw new FLException(220022, "五金单状态不可操作");
		}

		hardwarePO.setStatus(HardwarePO.STATUS_INSTORE_SHORT);
		hardwarePO.getProduction().setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		hardwareDao.update(hardwarePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int finishHardware(HardwareVO hardwareVO, String userId) throws FLException {

		HardwarePO hardwarePO = hardwareDao.get(hardwareVO.getHid());

		if (hardwarePO == null) {
			throw new FLException(220004, "五金单不存在");
		}

		if (hardwarePO.getStatus() != HardwarePO.STATUS_INSTORE_SHORT) {
			throw new FLException(220032, "五金单状态不可操作");
		}

		UserPO create = userDao.queryUserByUserId(userId);

		for (int i = 1; i <= hardwareVO.getNum(); i++) {

			TranpackPO tranpackPO = new TranpackPO();
			String no = hardwarePO.getNo() + "-" + i;

			tranpackPO.setNo(no);
			tranpackPO.setType(TranpackPO.TYPE_HARDWARE_INT);
			tranpackPO.setCreater(create);
			tranpackPO.setProduction(hardwarePO.getProduction());
			tranpackPO.setRid(hardwarePO.getHid());
			tranpackPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

			tranpackDao.save(tranpackPO);
		}

		hardwarePO.setStatus(HardwarePO.STATUS_FINISH_SHORT);
		hardwarePO.setFinishTime(DateUtil.getDateToTimestamp(new Date()));
		hardwarePO.getProduction().setUpdateTime(DateUtil.getDateToTimestamp(new Date()));
		hardwareDao.update(hardwarePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteHardware(HardwareVO hardwareVO) throws FLException {

		HardwarePO hardwarePO = hardwareDao.get(hardwareVO.getHid());

		if (hardwarePO == null) {
			throw new FLException(220004, "五金单不存在");
		}

		if (hardwarePO.getStatus() != HardwarePO.STATUS_INIT_SHORT && hardwarePO.getStatus() != HardwarePO.STATUS_PURCHASE_SHORT) {
			throw new FLException(220022, "五金单状态不可操作");
		}

		hardwareDao.delete(hardwarePO);
		hardwareItemDao.deleteHardwareItemByHid(hardwareVO.getHid());

		return 0;
	}

	// PO赋值
	private HardwareVO copyHardwarePO(HardwarePO hardwarePO) {

		HardwareVO hardwareVO = new HardwareVO(new ProductionVO(new HouseVO(new VillageVO()), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO()), new UserBaseVO());

		BeanUtil.copyProperties(hardwarePO, hardwareVO, Arrays.asList("production", "creater"));
		BeanUtil.copyProperties(hardwarePO.getProduction(), hardwareVO.getProduction(), Arrays.asList("house", "creater", "brand", "salesman", "designer", "spliter"));
		BeanUtil.copyProperties(hardwarePO.getProduction().getCreater(), hardwareVO.getProduction().getCreater(), Arrays.asList("duty", "dept"));
		BeanUtil.copyProperties(hardwarePO.getProduction().getSalesman(), hardwareVO.getProduction().getSalesman(), Arrays.asList("duty", "dept"));
		BeanUtil.copyProperties(hardwarePO.getProduction().getDesigner(), hardwareVO.getProduction().getDesigner(), Arrays.asList("duty", "dept"));
		BeanUtil.copyProperties(hardwarePO.getProduction().getSpliter(), hardwareVO.getProduction().getSpliter(), Arrays.asList("duty", "dept"));
		BeanUtil.copyProperties(hardwarePO.getCreater(), hardwareVO.getCreater(), Arrays.asList("duty", "dept"));

		if (hardwarePO.getProduction().getHouse() != null) hardwarePO.getProduction().getHouse().ptv(hardwareVO.getProduction().getHouse());

		return hardwareVO;
	}
}
