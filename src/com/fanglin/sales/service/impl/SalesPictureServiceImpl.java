package com.fanglin.sales.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.dao.SalesPictureDao;
import com.fanglin.sales.po.SalesPicturePO;
import com.fanglin.sales.service.SalesPictureService;
import com.fanglin.sales.vo.SalesPictureVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("salesPictureService")
@Transactional(readOnly = true)
public class SalesPictureServiceImpl implements SalesPictureService {

	@Autowired
	private SalesPictureDao salesPictureDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	public List<SalesPictureVO> querySalesPicture(SalesPictureVO salesPictureVO) {

		List<SalesPicturePO> salesPicturePOs = salesPictureVO.getSiid() != null ? salesPictureDao.querySalesPictureBySiid(salesPictureVO.getSiid()) : salesPictureDao.querySalesPictureBySid(salesPictureVO.getSid());
		List<SalesPictureVO> salesPictureVOs = new ArrayList<SalesPictureVO>();

		for (SalesPicturePO salesPicturePO : salesPicturePOs) {
			salesPictureVOs.add(ptv(salesPicturePO));
		}

		return salesPictureVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addSalesPicture(SalesPictureVO salesPictureVO, String userId, int company) throws FLException {

		SystemConfigPO limit = systemConfigDao.querySystemConfig("SALES_PICTURE_LIMIT", company);

		if (salesPictureDao.countSalesPicture(salesPictureVO.getSid(), salesPictureVO.getType()) > (limit == null ? 4 : Integer.parseInt(limit.getValue()))) {
			throw new FLException(110017, "资源数已达上限");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		SalesPicturePO salesPicturePO = new SalesPicturePO();

		BeanUtil.copyPropertie(salesPictureVO, salesPicturePO, Arrays.asList("creater"));

		salesPicturePO.setCreater(creater);
		salesPicturePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		salesPictureDao.save(salesPicturePO);

		salesPictureVO.setSpid(salesPicturePO.getSpid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteSalesPicture(SalesPictureVO salesPicture) {

		SalesPicturePO salesPicturePO = salesPictureDao.get(salesPicture.getSpid());

		salesPicturePO.setStatus(SalesPicturePO.STATUS_DEL_SHORT);

		salesPictureDao.update(salesPicturePO);

		return 0;
	}

	public SalesPictureVO ptv(SalesPicturePO salesPicturePO) {

		SalesPictureVO salesPictureVO = new SalesPictureVO(new UserBaseVO(new DutyVO(), new DepartmentVO()));

		BeanUtil.copyProperties(salesPicturePO, salesPictureVO, Arrays.asList("creater"));
		BeanUtil.copyProperties(salesPicturePO.getCreater(), salesPictureVO.getCreater(), Arrays.asList("dept", "duty"));

		return salesPictureVO;
	}

}
