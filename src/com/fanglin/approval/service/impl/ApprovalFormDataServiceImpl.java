/**
 * @File Name		: ApprovalFormDataServiceImpl.java
 * @Package   		: com.fanglin.approval.service.impl
 * @Version			: 1.0
 * @Description		: 审批表单填写数据存取服务实现。
 * 					  saveFormData:把 fieldKey→fieldValue 映射转为 EAV 行(fieldId→fieldValue)存入。
 * 					  queryFormDataMap:反向,把 EAV 行按 fieldKey 组装成 Map 返回给业务层。
 */

package com.fanglin.approval.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalFormDataDao;
import com.fanglin.approval.dao.ApprovalFormFieldDao;
import com.fanglin.approval.po.ApprovalFormDataPO;
import com.fanglin.approval.po.ApprovalFormFieldPO;
import com.fanglin.approval.service.ApprovalFormDataService;
import com.fanglin.approval.vo.ApprovalFormDataVO;
import com.fanglin.core.interceptor.FLException;

@Service("approvalFormDataService")
@Transactional(readOnly = true)
public class ApprovalFormDataServiceImpl implements ApprovalFormDataService {

	@Autowired
	private ApprovalFormDataDao approvalFormDataDao;

	@Autowired
	private ApprovalFormFieldDao approvalFormFieldDao;

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void saveFormData(long aid, long formId, Map<String, String> formData, Long taskId) throws FLException {

		if (formData == null || formData.isEmpty()) {
			return;
		}

		// 查表单字段定义,建 fieldKey→fieldId 索引
		List<ApprovalFormFieldPO> fieldPOs = approvalFormFieldDao.queryApprovalFormFieldByFormId(formId);
		Map<String, Long> keyToId = new HashMap<String, Long>();
		for (ApprovalFormFieldPO fieldPO : fieldPOs) {
			keyToId.put(fieldPO.getFieldKey(), fieldPO.getFieldId());
		}

		for (Map.Entry<String, String> entry : formData.entrySet()) {

			String fieldKey = entry.getKey();
			String fieldValue = entry.getValue();

			Long fieldId = keyToId.get(fieldKey);
			if (fieldId == null) {
				// 字段定义里不存在的 key,跳过(避免脏数据)
				continue;
			}

			ApprovalFormDataPO dataPO = new ApprovalFormDataPO();
			dataPO.setAid(aid);
			dataPO.setFieldId(fieldId);
			dataPO.setFieldValue(fieldValue);
			dataPO.setTaskId(taskId);
			approvalFormDataDao.save(dataPO);
		}
	}

	@Override
	public Map<String, String> queryFormDataMap(long aid) throws FLException {

		List<ApprovalFormDataPO> dataPOs = approvalFormDataDao.queryApprovalFormDataByAid(aid);

		// 收集所有 fieldId,批量查字段定义
		Map<Long, ApprovalFormFieldPO> fieldMap = buildFieldMap(dataPOs);

		Map<String, String> result = new HashMap<String, String>();
		for (ApprovalFormDataPO dataPO : dataPOs) {
			ApprovalFormFieldPO fieldPO = fieldMap.get(dataPO.getFieldId());
			if (fieldPO != null) {
				result.put(fieldPO.getFieldKey(), dataPO.getFieldValue());
			}
		}

		return result;
	}

	@Override
	public List<ApprovalFormDataVO> queryFormDataList(long aid) throws FLException {

		List<ApprovalFormDataPO> dataPOs = approvalFormDataDao.queryApprovalFormDataByAid(aid);
		Map<Long, ApprovalFormFieldPO> fieldMap = buildFieldMap(dataPOs);

		List<ApprovalFormDataVO> result = new ArrayList<ApprovalFormDataVO>();
		for (ApprovalFormDataPO dataPO : dataPOs) {

			ApprovalFormDataVO vo = new ApprovalFormDataVO();
			vo.setDataId(dataPO.getDataId());
			vo.setAid(dataPO.getAid());
			vo.setFieldId(dataPO.getFieldId());
			vo.setFieldValue(dataPO.getFieldValue());
			vo.setTaskId(dataPO.getTaskId());

			ApprovalFormFieldPO fieldPO = fieldMap.get(dataPO.getFieldId());
			if (fieldPO != null) {
				vo.setFieldKey(fieldPO.getFieldKey());
				vo.setFieldLabel(fieldPO.getFieldLabel());
			}

			result.add(vo);
		}

		return result;
	}

	/**
	 * 批量查字段定义,建 fieldId→字段定义 映射(避免 N+1 查询)。
	 */
	private Map<Long, ApprovalFormFieldPO> buildFieldMap(List<ApprovalFormDataPO> dataPOs) {

		Map<Long, ApprovalFormFieldPO> fieldMap = new HashMap<Long, ApprovalFormFieldPO>();

		if (dataPOs == null || dataPOs.isEmpty()) {
			return fieldMap;
		}

		for (ApprovalFormDataPO dataPO : dataPOs) {
			if (!fieldMap.containsKey(dataPO.getFieldId())) {
				ApprovalFormFieldPO fieldPO = approvalFormFieldDao.get(dataPO.getFieldId());
				if (fieldPO != null) {
					fieldMap.put(fieldPO.getFieldId(), fieldPO);
				}
			}
		}

		return fieldMap;
	}

}
