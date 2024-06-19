package com.fanglin.quotation.service.impl;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.dao.QuotetionDao;
import com.fanglin.quotation.dao.QuotetionFunctionAreaDao;
import com.fanglin.quotation.dao.QuotetionFunctionAreaItemDao;
import com.fanglin.quotation.po.QuotetionFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotetionFunctionAreaPO;
import com.fanglin.quotation.po.QuotetionPO;
import com.fanglin.quotation.service.QuotetionFunctionAreaItemService;
import com.fanglin.quotation.vo.QuotetionFunctionAreaItemVO;
import com.fanglin.quotation.vo.QuotetionFunctionAreaVO;
import com.fanglin.quotation.vo.QuotetionVO;
import com.fanglin.utils.BeanUtil;

@Service("quotetionFunctionAreaItemService")
@Transactional(readOnly = true)
public class QuotetionFunctionAreaItemServiceImpl implements QuotetionFunctionAreaItemService {

	@Autowired
	private QuotetionDao quotetionDao;

	@Autowired
	private QuotetionFunctionAreaItemDao quotetionFunctionAreaItemDao;

	@Autowired
	private QuotetionFunctionAreaDao quotetionFunctionAreaDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public QuotetionFunctionAreaItemVO updateQuotetionFunctionAreaItem(QuotetionFunctionAreaItemVO quotetionFunctionAreaItemVO, QuotetionVO quotetionVO) throws FLException {

		QuotetionPO quotetionPO = checkQuotetionForStatusByEnabled(quotetionVO.getQid());

		QuotetionServiceImpl.convertQuotetionVOToPOForAdvance(quotetionVO, quotetionPO);

		Long qfaiId = quotetionFunctionAreaItemVO.getQfaiId();

		QuotetionFunctionAreaPO quotetionFunctionAreaPO = quotetionFunctionAreaDao.get(quotetionFunctionAreaItemVO.getQfaid());

		if (qfaiId != null) {

			QuotetionFunctionAreaItemPO quotetionFunctionAreaItemPO = quotetionFunctionAreaItemDao.queryQuotetionFunctionAreaItemByQfaiId(QuotetionFunctionAreaItemPO.factoryToClazz(quotetionFunctionAreaPO.getQfaId(), quotetionFunctionAreaPO.getIndex()), qfaiId);

			if (quotetionFunctionAreaItemPO == null) {
				throw new FLException(200013, "报价项不存在");
			}
			quotetionFunctionAreaItemPO.setFormula(quotetionFunctionAreaItemVO.getFormula());
			quotetionFunctionAreaItemPO.setNum(quotetionFunctionAreaItemVO.getNum());
			quotetionFunctionAreaItemDao.update(quotetionFunctionAreaItemPO);
		} else {

			QuotetionFunctionAreaItemPO quotetionFunctionAreaItemPO = QuotetionFunctionAreaItemPO.factoryToInstance(quotetionFunctionAreaPO.getQfaId(), quotetionFunctionAreaPO.getIndex());

			BeanUtil.copyProperties(quotetionFunctionAreaItemVO, quotetionFunctionAreaItemPO);

			if (Arrays.asList(QuotetionFunctionAreaItemPO.TYPE_COMMON_INT, QuotetionFunctionAreaItemPO.TYPE_IGNORE_INT, QuotetionFunctionAreaItemPO.TYPE_COST_INT, QuotetionFunctionAreaItemPO.TYPE_UNACHE_INT).contains(quotetionFunctionAreaItemVO.getType())) {

				quotetionFunctionAreaItemPO.setQiid(quotetionFunctionAreaItemVO.getQiid());
				quotetionFunctionAreaItemPO.setContent(null);
			} else {
				quotetionFunctionAreaItemPO.setContent(quotetionFunctionAreaItemVO.getContent());
			}
			quotetionFunctionAreaItemDao.save(quotetionFunctionAreaItemPO);

			quotetionFunctionAreaItemVO.setQfaiId(quotetionFunctionAreaItemPO.getQfaiId());
		}

		quotetionDao.update(quotetionPO);

		return quotetionFunctionAreaItemVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotetionFunctionAreaItemForIndex(List<QuotetionFunctionAreaItemVO> quotetionFunctionAreaItemVOs, QuotetionFunctionAreaVO quotetionFunctionAreaVO) throws FLException {

		QuotetionFunctionAreaPO quotetionFunctionAreaPO = quotetionFunctionAreaDao.get(quotetionFunctionAreaVO.getQfaId());

		String table = QuotetionFunctionAreaItemPO.quotetionFunctionAreaItemTable(quotetionFunctionAreaPO.getQfaId(), quotetionFunctionAreaPO.getIndex());

		for (QuotetionFunctionAreaItemVO quotetionFunctionAreaItemVO : quotetionFunctionAreaItemVOs) {
			quotetionFunctionAreaItemDao.updateQuotetionFunctionAreaItemForIndex(table, quotetionFunctionAreaItemVO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateQuotetionFunctionAreaItemForSpec(QuotetionFunctionAreaItemVO quotetionFunctionAreaItemVO, QuotetionVO quotetionVO) throws FLException {

		QuotetionPO quotetionPO = checkQuotetionForStatusByEnabled(quotetionVO.getQid());

		QuotetionServiceImpl.convertQuotetionVOToPOForAdvance(quotetionVO, quotetionPO);

		List<Short> types = Arrays.asList(QuotetionFunctionAreaItemPO.TYPE_TRAFFIC_INT, QuotetionFunctionAreaItemPO.TYPE_MANAGE_INT);

		QuotetionFunctionAreaPO quotetionFunctionAreaPO = quotetionFunctionAreaDao.queryQuotetionFunctionAreaForTypeByQuotetionId(quotetionVO.getQid(), QuotetionFunctionAreaPO.TYPE_MANAGEMENT_INT);

		QuotetionFunctionAreaItemPO quotetionFunctionAreaItemPO = quotetionFunctionAreaItemDao.queryQuotetionFunctionAreaItemByQfaiId(QuotetionFunctionAreaItemPO.factoryToClazz(quotetionFunctionAreaPO.getQfaId(), quotetionFunctionAreaPO.getIndex()), quotetionFunctionAreaItemVO.getQfaiId());

		if (quotetionFunctionAreaItemPO == null) {
			throw new FLException(200013, "报价项不存在");
		}

		short type = quotetionFunctionAreaItemPO.getType();

		if (types.contains(type)) {

			quotetionFunctionAreaItemPO.setUnitPrice(quotetionFunctionAreaItemVO.getUnitPrice());

			quotetionFunctionAreaItemDao.update(quotetionFunctionAreaItemPO);

			quotetionDao.update(quotetionPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteQuotetionFunctionAreaItem(List<Long> qfaiIds, QuotetionVO quotetionVO, QuotetionFunctionAreaVO quotetionFunctionAreaVO) throws FLException {

		QuotetionPO quotetionPO = checkQuotetionForStatusByEnabled(quotetionVO.getQid());

		QuotetionFunctionAreaPO quotetionFunctionAreaPO = quotetionFunctionAreaDao.get(quotetionFunctionAreaVO.getQfaId());

		if (quotetionFunctionAreaPO == null) {
			throw new FLException(200012, "功能区不存在");
		}

		QuotetionServiceImpl.convertQuotetionVOToPOForAdvance(quotetionVO, quotetionPO);

		if (qfaiIds != null && qfaiIds.size() > 0) {

			String tableName = QuotetionFunctionAreaItemPO.quotetionFunctionAreaItemTable(quotetionFunctionAreaPO.getQfaId(), quotetionFunctionAreaPO.getIndex());

			quotetionFunctionAreaItemDao.deleteQuotetionFunctionAreaItemByQfaiIds(tableName, qfaiIds);
		}

		quotetionDao.update(quotetionPO);

		return 0;
	}

	private QuotetionPO checkQuotetionForStatusByEnabled(Long qid) throws FLException {

		QuotetionPO quotetionPO = quotetionDao.get(qid);

		if (quotetionPO == null) {
			throw new FLException(200003, "报价不存在");
		}

		return quotetionPO;
	}

}
