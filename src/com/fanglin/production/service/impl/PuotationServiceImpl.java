package com.fanglin.production.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.production.dao.ProductionDao;
import com.fanglin.production.dao.PuotationDao;
import com.fanglin.production.dao.PuotationItemDao;
import com.fanglin.production.po.ProductionPO;
import com.fanglin.production.po.PuotationItemPO;
import com.fanglin.production.po.PuotationPO;
import com.fanglin.production.service.PuotationService;
import com.fanglin.production.vo.PuotationItemVO;
import com.fanglin.production.vo.PuotationVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("puotationsService")
@Transactional(readOnly = true)
public class PuotationServiceImpl implements PuotationService {

	@Autowired
	private PuotationDao puotationDao;
	
	@Autowired
	private ProductionDao productionDao;

	@Autowired
	private PuotationItemDao puotationItemDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<PuotationVO> queryPuotationByPid(PuotationVO puotationVO) {
		
		List<PuotationPO> puotationPOs = puotationDao.queryPuotationByPid(puotationVO.getPid());
		List<PuotationVO> puotationVOs = new ArrayList<PuotationVO>();
		
		for (PuotationPO puotationPO : puotationPOs) {

			puotationVO = new PuotationVO(new UserBaseVO());

			BeanUtil.copyProperties(puotationPO, puotationVO, Arrays.asList("creater"));
			puotationVO.setCreater(new UserBaseVO());

			BeanUtil.copyProperties(puotationPO.getCreater(), puotationVO.getCreater(), Arrays.asList("duty", "dept"));

			puotationVOs.add(puotationVO);
		}
		
		return puotationVOs;
	}

	@Override
	public List<PuotationItemVO> queryPuotationItemByQid(PuotationVO puotationVO) {

		List<PuotationItemPO> puotationItemPOs = puotationItemDao.queryPuotationItemByQid(puotationVO.getQid());
		List<PuotationItemVO> puotationItemVOs = new ArrayList<PuotationItemVO>();
		
		for (PuotationItemPO puotationItemPO : puotationItemPOs) {

			PuotationItemVO puotationItemVO = new PuotationItemVO();

			BeanUtil.copyProperties(puotationItemPO, puotationItemVO);

			puotationItemVOs.add(puotationItemVO);
		}
		
		return puotationItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addPuotation(PuotationVO puotationVO, List<PuotationItemVO> puotationItems, String userId) throws FLException {

        ProductionPO productionPO = productionDao.get(puotationVO.getPid());
        
		if(productionPO == null){
			throw new FLException(220001, "生产单不存在");
		}
        
		if(productionPO.getStatus() != ProductionPO.STATUS_INIT_SHORT){
			throw new FLException(220002, "生产单状态不可操作");
		}
		
		PuotationPO puotationPO = new PuotationPO();

		UserPO creater = userDao.queryUserByUserId(userId);
		
		puotationPO.setPid(puotationVO.getPid());
		puotationPO.setName(puotationVO.getName());
		puotationPO.setCreater(creater);
		puotationPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		puotationPO.setTotal(puotationVO.getTotal());
		puotationPO.setDiscount(1000);
		puotationPO.setComment(puotationVO.getComment());

		puotationDao.save(puotationPO);

		if (puotationItems != null && puotationItems.size() != 0) {

			PuotationItemPO puotationItemPO;

			for (PuotationItemVO puotationItemVO : puotationItems) {

				puotationItemPO = new PuotationItemPO();
				puotationItemPO.setQid(puotationPO.getQid());
				BeanUtil.copyProperties(puotationItemVO, puotationItemPO);

				puotationItemDao.save(puotationItemPO);

			}
		}

		return 0;
	}

	
	@Override
	@SuppressWarnings("unused")
	@Transactional(rollbackFor = Exception.class)
	public int addPuotationItem(PuotationItemVO puotationItemVO) throws FLException {
		
		PuotationPO puotationPO = puotationDao.queryPuotationByQid(puotationItemVO.getQid());
		
		ProductionPO productionPO = productionDao.get(puotationPO.getPid());
		
		PuotationItemPO puotationItemPO = new PuotationItemPO();
		
		if(productionPO.getStatus() != ProductionPO.STATUS_INIT_SHORT){
			throw new FLException(220002, "生产单状态不可操作");
		}
		
		if(puotationPO == null){
			throw new FLException(220014 , "报价不存在");
		}
		
		BeanUtil.copyProperties(puotationItemVO, puotationItemPO);

		puotationItemDao.save(puotationItemPO);

		long total = puotationPO.getTotal();
		puotationPO.setTotal(Arith.add(total, Arith.mul(puotationItemVO.getTotal(), puotationPO.getDiscount())));

		puotationDao.update(puotationPO);
		
		return 0;
	}

	@Override
	@SuppressWarnings("unused")
	@Transactional(rollbackFor = Exception.class)
	public int updatePuotation(PuotationVO puotationVO) throws FLException {

		PuotationPO puotationPO = puotationDao.queryPuotationByQid(puotationVO.getQid());
		ProductionPO productionPO = productionDao.get(puotationPO.getPid());
		
		if(productionPO.getStatus() != ProductionPO.STATUS_INIT_SHORT){
			throw new FLException(220002, "生产单状态不可操作");
		}
		
		if (puotationPO == null) {
			throw new FLException(220014, "报价不存在");
		}

		BeanUtil.copyProperties(puotationVO, puotationPO, Arrays.asList("creater"));

		puotationPO.setName(puotationVO.getName());
		puotationPO.setComment(puotationVO.getComment());

		puotationDao.update(puotationPO);
		return 0;
	}

	@Override
	@SuppressWarnings("unused")
	@Transactional(rollbackFor = Exception.class)
	public int updatePuotationForAdvance(PuotationVO puotationVO) throws FLException {

		PuotationPO puotationPO = puotationDao.queryPuotationByQid(puotationVO.getQid());
        ProductionPO productionPO = productionDao.get(puotationPO.getPid());
		
		if(productionPO.getStatus() != ProductionPO.STATUS_INIT_SHORT){
			throw new FLException(220002, "生产单状态不可操作");
		}
		if (puotationPO == null) {
			throw new FLException(220014, "报价不存在");
		}
		BeanUtil.copyProperties(puotationVO, puotationPO, Arrays.asList("creater"));

		puotationPO.setDiscount(puotationVO.getDiscount());
		puotationPO.setTotal(puotationVO.getTotal());

		puotationDao.update(puotationPO);

		return 0;
	}

	@Override
	@SuppressWarnings("unused")
	@Transactional(rollbackFor = Exception.class)
	public int updatePuotationForDefault(PuotationVO puotationVO) throws FLException {

		PuotationPO puotationPO = puotationDao.queryPuotationByQid(puotationVO.getQid());
        ProductionPO productionPO = productionDao.get(puotationPO.getPid());
		
		if(productionPO.getStatus() != ProductionPO.STATUS_INIT_SHORT){
			throw new FLException(220002, "生产单状态不可操作");
		}
		
		if (puotationPO == null) {
			throw new FLException(220014, "报价不存在");
		}

		BeanUtil.copyProperties(puotationVO, puotationPO, Arrays.asList("creater"));

		puotationPO.setStatus(puotationPO.getStatus() == 1 ? (short) 0 : (short) 1);

		return 0;
	}

	@Override
	@SuppressWarnings("unused")
	@Transactional(rollbackFor = Exception.class)
	public int deletePuotation(PuotationVO puotationVO) throws FLException {

		PuotationPO puotationPO = puotationDao.queryPuotationByQid(puotationVO.getQid());
        ProductionPO productionPO = productionDao.get(puotationPO.getPid());
		
		if(productionPO.getStatus() != ProductionPO.STATUS_INIT_SHORT){
			throw new FLException(220002, "生产单状态不可操作");
		}
		
		if (puotationPO == null) {
			throw new FLException(220014, "报价不存在");
		}
		
		puotationDao.delete(puotationPO);
		puotationItemDao.deletePuotationItemByQId(puotationVO.getQid());

		return 0;
	}

	@Override
	@SuppressWarnings("unused")
	@Transactional(rollbackFor = Exception.class)
	public int deletePuotationItem(PuotationItemVO puotationItemVO) throws FLException {

		PuotationPO puotationPO = puotationDao.queryPuotationByQid(puotationItemVO.getQid());
        ProductionPO productionPO = productionDao.get(puotationPO.getPid());
		
		if(productionPO.getStatus() != ProductionPO.STATUS_INIT_SHORT){
			throw new FLException(220002, "生产单状态不可操作");
		}
		
		if (puotationPO == null) {
			throw new FLException(220014, "报价不存在");
		}

		PuotationItemPO puotationItemPO = puotationItemDao.queryPuotationItemByQiid(puotationItemVO.getQiid());
		puotationItemDao.delete(puotationItemPO);

		long total = puotationPO.getTotal();
		puotationPO.setTotal(Arith.sub(total, Arith.mul(puotationItemPO.getTotal(), puotationPO.getDiscount())));

		puotationDao.update(puotationPO);
		
		return 0;
	}

}
