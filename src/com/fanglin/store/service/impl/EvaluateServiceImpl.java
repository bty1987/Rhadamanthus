package com.fanglin.store.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.dao.EvaluateDao;
import com.fanglin.store.dao.MorderDao;
import com.fanglin.store.dao.MpriceDao;
import com.fanglin.store.dao.MuserDao;
import com.fanglin.store.po.EvaluatePO;
import com.fanglin.store.po.MorderPO;
import com.fanglin.store.po.MpricePO;
import com.fanglin.store.po.MuserPO;
import com.fanglin.store.service.EvaluateService;
import com.fanglin.store.vo.EvaluateVO;
import com.fanglin.store.vo.McolorVO;
import com.fanglin.store.vo.MformatVO;
import com.fanglin.store.vo.MgoodsVO;
import com.fanglin.store.vo.MorderVO;
import com.fanglin.store.vo.MpriceVO;
import com.fanglin.store.vo.MuserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("evaluateService")
@Transactional(readOnly = true)
public class EvaluateServiceImpl implements EvaluateService {

	@Autowired
	private EvaluateDao evaluateDao;

	@Autowired
	private MpriceDao mpriceDao;

	@Autowired
	private MuserDao muserDao;

	@Autowired
	private MorderDao morderDao;

	@Override
	public void pageEvaluate(Paging paging, List<Filter> filters) {

		List<EvaluatePO> evaluatePOs = evaluateDao.pageEvaluate(paging, filters);
		List<EvaluateVO> evaluateVOs = new ArrayList<EvaluateVO>();

		for (EvaluatePO evaluatePO : evaluatePOs) {

			EvaluateVO evaluateVO = new EvaluateVO(new MpriceVO(new MgoodsVO(), new McolorVO(), new MformatVO()));

			BeanUtil.copyProperties(evaluatePO, evaluateVO, Arrays.asList("mprice"));
			BeanUtil.copyProperties(evaluatePO.getMprice(), evaluateVO.getMprice(), Arrays.asList("mgoods", "mcolor", "mformat"));
			BeanUtil.copyProperties(evaluatePO.getMprice().getMgoods(), evaluateVO.getMprice().getMgoods(), Arrays.asList("mbrand"));
			BeanUtil.copyProperties(evaluatePO.getMprice().getMcolor(), evaluateVO.getMprice().getMcolor());
			BeanUtil.copyProperties(evaluatePO.getMprice().getMformat(), evaluateVO.getMprice().getMformat());

			evaluateVOs.add(evaluateVO);
		}

		paging.setData(evaluateVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addEvaluate(List<EvaluateVO> evaluates, MuserVO muser, MorderVO morder) throws FLException {

		for (EvaluateVO evaluateVO : evaluates) {

			MuserPO muserPO = muserDao.queryMuserByUnionId(muser.getUnionId());

			if (muserPO == null) {
				throw new FLException(340009, "用户不存在");
			}

			MorderPO mroderPO = morderDao.get(morder.getOid());

			if (mroderPO == null) {
				throw new FLException(340012, "订单不存在");
			}

			MpricePO mpricePO = mpriceDao.queryMpriceByPid(evaluateVO.getMprice().getPid());

			EvaluatePO evaluatePO = new EvaluatePO(mpricePO);

			BeanUtil.copyProperties(evaluateVO, evaluatePO, Arrays.asList("mprice", "oid", "unionId"));

			evaluatePO.setUnionId(muser.getUnionId());
			evaluatePO.setOid(morder.getOid());
			evaluatePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

			evaluateDao.save(evaluatePO);
		}

		return 0;
	}
}
