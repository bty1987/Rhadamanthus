package com.fanglin.data.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.PresignItemPO;
import com.fanglin.data.po.PresignProducePO;
import com.fanglin.data.quotation.dao.PresignItemDao;
import com.fanglin.data.quotation.dao.PresignProduceDao;
import com.fanglin.data.quotation.service.PresignProduceService;
import com.fanglin.data.quotation.vo.PresignItemVO;
import com.fanglin.data.quotation.vo.PresignProduceVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("presignProduceService")
@Transactional(readOnly = true)
public class PresignProduceServiceImpl implements PresignProduceService {

	@Autowired
	private PresignProduceDao presignProduceDao;

	@Autowired
	private PresignItemDao presignItemDao;

	@Autowired
	private CompanyDao companyDao;

	@Override
	public void pagePresignProduce(Paging paging, List<Filter> filters, int company) {

		List<PresignProducePO> presignProducePOs = presignProduceDao.pagePresignProduce(paging, filters, company);
		List<PresignProduceVO> presignProduceVOs = new ArrayList<PresignProduceVO>();

		PresignProduceVO presignProduceVO;

		for (PresignProducePO presignProducePO : presignProducePOs) {

			presignProduceVO = new PresignProduceVO();

			BeanUtil.copyPropertie(presignProducePO, presignProduceVO);

			presignProduceVOs.add(presignProduceVO);
		}

		paging.setData(presignProduceVOs);
	}

	@Override
	public List<PresignProduceVO> queryPresignProduce(PresignProduceVO presignProduceVO, int company) throws FLException {

		List<PresignProduceVO> presignProduceVOs = new ArrayList<PresignProduceVO>();
		List<PresignProducePO> presignProducePOs = presignProduceDao.queryPresignProduce(company);

		for (PresignProducePO presignProducePO : presignProducePOs) {

			presignProduceVO = new PresignProduceVO();

			BeanUtil.copyPropertie(presignProducePO, presignProduceVO);

			presignProduceVOs.add(presignProduceVO);
		}

		return presignProduceVOs;
	}

	@Override
	public PresignProduceVO queryPresignProduceByPpid(PresignProduceVO presignProduceVO) {

		PresignProducePO presignProducePO = presignProduceDao.get(presignProduceVO.getPpid());

		BeanUtil.copyProperties(presignProducePO, presignProduceVO, Arrays.asList("creater"));

		return presignProduceVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addPresignProduce(PresignProduceVO presignProduceVO, int company) throws FLException {

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		PresignProducePO presignProducePO = new PresignProducePO();

		presignProducePO.setCompany(company);

		BeanUtil.copyProperties(presignProduceVO, presignProducePO);

		presignProduceDao.save(presignProducePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updatePresignProduce(PresignProduceVO presignProduceVO, List<PresignItemVO> presignItems) throws FLException {

		PresignProducePO presignProducePO = presignProduceDao.get(presignProduceVO.getPpid());

		if (presignProducePO == null) {
			throw new FLException(130080, "预签产品不存在");
		}

		if (presignProducePO.getStatus() == 0) {
			throw new FLException(130081, "预签产品不可操作");
		}

		BeanUtil.copyProperties(presignProduceVO, presignProducePO);

		presignProduceDao.update(presignProducePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updatePresignProduceForStatus(PresignProduceVO presignProduceVO) throws FLException {

		PresignProducePO presignProducePO = presignProduceDao.get(presignProduceVO.getPpid());

		if (presignProducePO == null) {
			throw new FLException(130080, "预签产品不存在");
		}

		presignProducePO.setStatus(presignProduceVO.getStatus());

		presignProduceDao.update(presignProducePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void copyPresignProduce(PresignProduceVO presignProduceVO) throws FLException {

		PresignProducePO presignProducePO = presignProduceDao.get(presignProduceVO.getPpid());

		List<PresignItemPO> presignItemPOs = presignItemDao.queryPresignItem(presignProduceVO.getPpid());

		if (presignProducePO == null) {
			throw new FLException(130080, "预签产品不存在");
		}

		PresignProducePO newPresignProduce = new PresignProducePO();

		BeanUtil.copyProperties(presignProducePO, newPresignProduce, Arrays.asList("ppid"));

		presignProduceDao.save(newPresignProduce);

		for (PresignItemPO presignItemPO : presignItemPOs) {

			PresignItemPO presignItem = new PresignItemPO();

			presignItem.setPpid(newPresignProduce.getPpid());

			BeanUtil.copyPropertie(presignItemPO, presignItem, Arrays.asList("ppid", "piid"));

			presignItemDao.save(presignItem);
		}

	}

}
