	@Override
	@Transactional(rollbackFor = Exception.class)
	public int finishDrawLine(DrawLineVO drawLineVO, String userId) throws FLException {

		// 🚀 直接查询装修单和工程信息，不判断放线是否存在
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(drawLineVO.getDecoration().getOrderId());

		if (decorationPO == null) {
			throw new FLException(130014, "装修不存在");
		}

		String orderId = decorationPO.getOrderId();

		// 🚀 查询已有的工程信息（不创建）
		ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(orderId);

		if (constructionPO == null) {
			throw new FLException(120020, "工程信息不存在，请先放线");
		}

		long cid = constructionPO.getCid();

		ConstructionInfoPO constructionInfoPO = constructionInfoDao.queryConstructionInfoByOrderId(orderId);

		if (constructionInfoPO == null) {
			throw new FLException(120020, "工程信息不存在");
		}

		// 获取所有施工节点（用于创建/更新施工计划）
		List<ConstructionNodePO> constructionNodePOs = constructionNodeDao.queryConstructionNodeList();

		if (constructionNodePOs == null || constructionNodePOs.size() == 0) {
			throw new FLException(120020, "施工节点不存在");
		}

		// 🚀 执行 successDrawLine 的完整逻辑（更新施工计划）
		int timelimit = 0;
		SystemConfigPO salaryLimitTotal = systemConfigDao.querySystemConfig("WORKER_SALARY_LIMIT_TOTAL_INT", decorationPO.getCompany());

		Timestamp drawlineTime = constructionInfoPO.getDrawlineTime() == null ? DateUtil.getDateToTimestamp(new Date()) : constructionInfoPO.getDrawlineTime();

		for (ConstructionNodePO constructionNodePO : constructionNodePOs) {

			if (constructionNodePO.getTimeLimit() == null) constructionNodePO.setTimeLimit(0);

			int prenum = constructionNodePO.getPrenum() != null ? constructionNodePO.getPrenum() : 0;
			int postnum = constructionNodePO.getPostnum() != null ? constructionNodePO.getPostnum() : 0;

			Timestamp startTime = DateUtil.getDateToTimestamp(DateUtil.plusDay(DateUtil.getTimestampToDate(drawlineTime), Arith.div(timelimit + prenum, 1000000)));
			Timestamp endTime = DateUtil.getDateToTimestamp(DateUtil.plusDay(DateUtil.getTimestampToDate(drawlineTime), Arith.div((timelimit + prenum - 1000 + constructionNodePO.getTimeLimit()), 1000000)));

			ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByCid(cid, constructionNodePO.getCnid());

			if (constructionSchedulePO != null) {
				// 更新已有施工计划
				constructionSchedulePO.setPreStartTime(startTime);
				constructionSchedulePO.setPreEndTime(endTime);
				constructionSchedulePO.setStartTime(startTime);
				constructionSchedulePO.setEndTime(endTime);
				constructionSchedulePO.setPrenum(prenum);
				constructionSchedulePO.setPostnum(postnum);
				constructionSchedulePO.setPeriod(constructionNodePO.getTimeLimit() != null ? constructionNodePO.getTimeLimit() : 0);
				constructionScheduleDao.update(constructionSchedulePO);
			} else {
				// 创建新的施工计划（successDrawLine 的逻辑）
				ConstructionNodePO constructionNodeVO = constructionNodeDao.get(constructionNodePO.getCnid());

				if (constructionNodeVO == null) continue;

				constructionSchedulePO = new ConstructionSchedulePO(cid, orderId, startTime, endTime, constructionNodePO.getSort(), constructionNodePO.getTimeLimit(), prenum, postnum).init(constructionNodePO);

				constructionSchedulePO.setSalaryLimitTotal(salaryLimitTotal == null ? 5000000 : Integer.valueOf(salaryLimitTotal.getValue()));

				constructionScheduleDao.save(constructionSchedulePO);
			}

			timelimit = timelimit + prenum + (constructionNodePO.getTimeLimit() != null ? constructionNodePO.getTimeLimit() : 0) + postnum;

			constructionPO.setPreStartTime(drawlineTime);
			constructionPO.setPreEndTime(endTime);
			constructionPO.setPeriod(DateUtil.diffDay(drawlineTime, endTime));
		}

		constructionDao.update(constructionPO);

		// 🚀 设置放线状态为成功
		DrawLinePO drawLinePO = drawLineDao.get(drawLineVO.getDlid());
		if (drawLinePO != null) {
			drawLinePO.setStatus(DrawLinePO.STATUS_SUCCESS_INT);
			drawLineDao.update(drawLinePO);
		}

		// 更新装修单工程状态
		if (decorationPO.getProjectStatus() == DecorationPO.PROJECTSTATUS_INITIAL_INT) {
			decorationPO.setProjectStatus(DecorationPO.PROJECTSTATUS_START_INT);
			decorationDao.update(decorationPO);
		}

		// 生成消息队列数据（DRAWLINE_FINISHED 事件）
		messageQueuingDao.save(new MessageQueuingPO().init(
			orderId, 
			"finishDrawLine", 
			"{\"orderId\":\"" + orderId + "\",\"status\":\"1\",\"userId\":\"" + userId + "\",\"event\":\"DRAWLINE_FINISHED\"" + (decorationPO.getBusitype() != null ? ",\"busitypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + "}"
		));

		return 0;
	}
