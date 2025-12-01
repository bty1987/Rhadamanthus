package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.po.SurveyOptionPO;
import com.fanglin.data.po.FunctionAreaOptionPO;
import com.fanglin.data.po.FunctionAreaOtemPO;
import com.fanglin.data.po.FunctionAreaPO;
import com.fanglin.data.po.SurveyTemplateItemPO;
import com.fanglin.data.quotation.dao.FunctionAreaDao;
import com.fanglin.data.quotation.dao.FunctionAreaOtemDao;
import com.fanglin.quotation.dao.QeasureDao;
import com.fanglin.quotation.dao.QeasureFunctionAreaDao;
import com.fanglin.quotation.dao.QeasureItemDao;
import com.fanglin.quotation.dao.QeasureOptionDao;
import com.fanglin.quotation.po.QeasureFunctionAreaPO;
import com.fanglin.quotation.po.QeasureItemPO;
import com.fanglin.quotation.po.QeasureOptionPO;
import com.fanglin.quotation.po.QeasurePO;
import com.fanglin.quotation.service.QeasureFunctionAreaService;
import com.fanglin.quotation.vo.QeasureFunctionAreaVO;
import com.fanglin.quotation.vo.QeasureItemVO;
import com.fanglin.quotation.vo.QeasureOptionVO;
import com.fanglin.quotation.vo.QeasureVO;
import com.fanglin.utils.BeanUtil;

@Service("qeasureFunctionAreaService")
@Transactional(readOnly = true)
public class QeasureFunctionAreaServiceImpl implements QeasureFunctionAreaService {

	@Autowired
	private QeasureDao qeasureDao;

	@Autowired
	private QeasureFunctionAreaDao qeasureFunctionAreaDao;

	@Autowired
	private QeasureItemDao qeasureItemDao;

	@Autowired
	private QeasureOptionDao qeasureOptionDao;

	@Autowired
	private FunctionAreaDao functionAreaDao;

	@Autowired
	private FunctionAreaOtemDao functionAreaOtemDao;

	@Override
	public List<QeasureFunctionAreaVO> queryQeasureFunctionArea(QeasureFunctionAreaVO qeasureFunctionAreaVO) {

		List<QeasureFunctionAreaPO> qeasureFunctionAreaPOs = qeasureFunctionAreaDao.queryQeasureFunctionArea(qeasureFunctionAreaVO.getQmid());
		List<QeasureFunctionAreaVO> qeasureFunctionAreaVOs = new ArrayList<QeasureFunctionAreaVO>();

		for (QeasureFunctionAreaPO qeasureFunctionAreaPO : qeasureFunctionAreaPOs) {
			qeasureFunctionAreaVOs.add(qeasureFunctionAreaPO.ptv(new QeasureFunctionAreaVO()));
		}

		return qeasureFunctionAreaVOs;
	}

	@Override
	public QeasureFunctionAreaVO queryQeasureFunctionAreaByQmfaId(QeasureFunctionAreaVO qeasureFunctionAreaVO) {

		QeasureFunctionAreaPO qeasureFunctionAreaPO = qeasureFunctionAreaDao.get(qeasureFunctionAreaVO.getQmfaid());

		if (qeasureFunctionAreaPO == null) return qeasureFunctionAreaVO;

		List<QeasureItemPO> qeasureItemPOs = qeasureItemDao.queryQeasureItem(qeasureFunctionAreaPO.getQmfaid(), QeasureItemPO.ATTTYPE_FUNCTION_AREA_INT);

		if (qeasureItemPOs == null || qeasureItemPOs.size() == 0) return qeasureFunctionAreaPO.ptv(new QeasureFunctionAreaVO());

		return qeasureFunctionAreaPO.ptv(new QeasureFunctionAreaVO(new ArrayList<QeasureItemVO>()), qeasureItemPOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int makeQeasureFunctionArea(QeasureVO qeasureVO, QeasureFunctionAreaVO qeasureFunctionAreaVO) throws FLException {

		QeasurePO qeasurePO = qeasureDao.get(qeasureVO.getQmid());

		if (qeasurePO == null) {
			throw new FLException(200083, "量房单不存在");
		}

		FunctionAreaPO functionAreaPO = functionAreaDao.get(qeasureFunctionAreaVO.getFaid());

		if (functionAreaPO == null) {
			throw new FLException(130096, "功能区不存在");
		}

		List<FunctionAreaOtemPO> functionAreaOtemPOs = functionAreaOtemDao.queryFunctionAreaOtemByFaid(qeasureFunctionAreaVO.getFaid());

		QeasureFunctionAreaPO qeasureFunctionAreaPO = new QeasureFunctionAreaPO();

		BeanUtil.copyProperties(functionAreaPO, qeasureFunctionAreaPO, "");

		qeasureFunctionAreaPO.setQmid(qeasurePO.getQmid());

		qeasureFunctionAreaDao.save(qeasureFunctionAreaPO);

		for (FunctionAreaOtemPO functionAreaOtemPO : functionAreaOtemPOs) {

			QeasureItemPO qeasureItemPO = new QeasureItemPO();

			qeasureItemPO.setName(functionAreaOtemPO.getName());
			qeasureItemPO.setContent(functionAreaOtemPO.getContent());
			qeasureItemPO.setType(functionAreaOtemPO.getType());
			qeasureItemPO.setRequire(functionAreaOtemPO.getRequire());

			qeasureItemPO.setQmid(qeasurePO.getQmid());
			qeasureItemPO.setQmfaid(qeasureFunctionAreaPO.getQmfaid());
			qeasureItemPO.setAtttype(QeasureItemPO.ATTTYPE_FUNCTION_AREA_INT);

			qeasureItemDao.save(qeasureItemPO);

			if (Arrays.asList(SurveyTemplateItemPO.TYPE_TEXT_INT, SurveyTemplateItemPO.TYPE_INPUT_INT, QeasureItemPO.TYPE_DATE_INT).contains(functionAreaOtemPO.getType())) continue;

			List<FunctionAreaOptionPO> functionAreaOptionPOs = functionAreaOtemPO.getOptions();

			if (functionAreaOptionPOs == null) continue;

			for (FunctionAreaOptionPO functionAreaOptionPO : functionAreaOptionPOs) {

				QeasureOptionPO qeasureOptionPO = new QeasureOptionPO();

				qeasureOptionPO.setTitle(functionAreaOptionPO.getTitle());

				qeasureOptionPO.setQmid(qeasurePO.getQmid());
				qeasureOptionPO.setQmiid(qeasureItemPO.getQmiid());
				qeasureOptionPO.setQmfaid(qeasureFunctionAreaPO.getQmfaid());
				qeasureOptionPO.setChecked(SurveyOptionPO.CHECKED_INIT_INT);

				qeasureOptionDao.save(qeasureOptionPO);
			}
		}

		qeasureVO.setQmid(qeasurePO.getQmid());

		BeanUtil.copyProperties(qeasureFunctionAreaPO, qeasureFunctionAreaVO, "");

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int handleQeasureFunctionArea(QeasureVO qeasureVO, QeasureFunctionAreaVO qeasureFunctionAreaVO) throws FLException {

		if (qeasureFunctionAreaVO.getItems() == null) {
			throw new FLException(200083, "量房单不存在");
		}

		List<QeasureItemVO> qeasureItems = qeasureFunctionAreaVO.getItems();

		for (QeasureItemVO itemVO : qeasureItems) {

			QeasureItemPO itemPO = qeasureItemDao.get(itemVO.getQmiid());

			if (Arrays.asList(QeasureItemPO.TYPE_TEXT_INT, QeasureItemPO.TYPE_INPUT_INT, QeasureItemPO.TYPE_DATE_INT).contains(itemPO.getType())) {
				qeasureItemDao.update(itemPO.setContent(itemVO.getContent()));
			}

			List<QeasureOptionVO> options = itemVO.getOptions();

			if (options == null) continue;

			for (QeasureOptionVO optionVO : options) {

				if (optionVO == null) continue;

				QeasureOptionPO optionPO = qeasureOptionDao.get(optionVO.getQmoid());

				if (optionPO == null) continue;

				optionPO.setChecked(optionVO.getChecked());

				qeasureOptionDao.update(optionPO);
			}
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteQeasureFunctionArea(QeasureFunctionAreaVO qeasureFunctionAreaVO) {

		qeasureFunctionAreaDao.deleteById(qeasureFunctionAreaVO.getQmfaid());

		qeasureItemDao.deleteQeasureItem(qeasureFunctionAreaVO.getQmfaid(), QeasureItemPO.ATTTYPE_FUNCTION_AREA_INT);
		qeasureOptionDao.deleteQeasureOption(qeasureFunctionAreaVO.getQmid(), qeasureFunctionAreaVO.getQmfaid());

		return 0;
	}

}
