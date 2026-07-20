/**
 * @File Name		: ActionLogDaoImpl
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.log.dao.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.SQLQuery;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.log.dao.ActionLogDao;
import com.fanglin.log.po.ActionLogPO;
import com.fanglin.utils.Paging;

@Repository("actionLogDao")
public class ActionLogDaoImpl extends DaoImpl<ActionLogPO> implements ActionLogDao {

	/** 月份格式白名单：仅允许 6 位数字，与表名拼接配套使用防注入 */
	private static final Pattern MONTH_PATTERN = Pattern.compile("^\\d{6}$");

	public ActionLogDaoImpl() {
		super(ActionLogPO.class);
	}

	@Override
	public List<ActionLogPO> getPageActionLogPOs(Paging paging, List<Filter> filters) {
		PagingQuery<ActionLogPO> query = pagingQuery(paging, ActionLogPO.class);

		queryFilterExcute(query, filters);

		query.desc("createTime");

		return query.list();
	}

	@Override
	public List<ActionLogPO> getAllPageActionLogPOs(List<Filter> filters) {

		PagingQuery<ActionLogPO> query = pagingQuery(new Paging(), ActionLogPO.class);

		queryFilterExcute(query, filters);

		query.desc("createTime");
		query.notPaging();

		return query.list();
	}

	// ===== Phase 4.3: 热表+归档表 UNION ALL 查询 =====

	@Override
	public List<ActionLogPO> getPageActionLogPOsWithHistory(List<String> archiveMonths, Paging paging, List<Filter> filters){

		List<String> safeTables = sanitizeArchiveTables(archiveMonths);

		StringBuilder sql = new StringBuilder();
		sql.append(buildSelectWhere("log.actionlog", filters));
		for (String tbl : safeTables){
			sql.append(" UNION ALL ");
			sql.append(buildSelectWhere(tbl, filters));
		}
		sql.append(" ORDER BY createTime DESC");

		int pageStart = paging.getPage() != null && paging.getPage() > 0 ? (paging.getPage() - 1) * paging.getRows() : 0;
		int pageSize = paging.getRows() != null && paging.getRows() > 0 ? paging.getRows() : 20;
		sql.append(" LIMIT ").append(pageStart).append(", ").append(pageSize);

		SQLQuery query = session().createSQLQuery(sql.toString()).addEntity(ActionLogPO.class);
		bindFilterParams(query, filters);

		@SuppressWarnings("unchecked")
		List<ActionLogPO> list = query.list();
		return list;
	}

	@Override
	public long countActionLogPOsWithHistory(List<String> archiveMonths, List<Filter> filters){

		List<String> safeTables = sanitizeArchiveTables(archiveMonths);

		StringBuilder sql = new StringBuilder();
		sql.append(buildCountWhere("log.actionlog", filters));
		for (String tbl : safeTables){
			sql.append(" UNION ALL ");
			sql.append(buildCountWhere(tbl, filters));
		}

		// 外层求和；SUM(c) 即归档表 UNION count 的总和
		String wrapped = "SELECT SUM(c) FROM (" + sql.toString() + ") AS total";

		SQLQuery query = session().createSQLQuery(wrapped);
		bindFilterParams(query, filters);

		Number count = (Number) query.uniqueResult();
		return count == null ? 0 : count.longValue();
	}

	/** 归档月份白名单校验，返回完整表名集合。防注入：表名只能拼，不能绑参数。 */
	private List<String> sanitizeArchiveTables(List<String> archiveMonths){
		List<String> safe = new ArrayList<String>();
		if (archiveMonths == null) return safe;
		for (String ym : archiveMonths){
			if (ym != null && MONTH_PATTERN.matcher(ym).matches()){
				safe.add("log.actionlog_" + ym);
			}
		}
		return safe;
	}

	private String buildSelectWhere(String table, List<Filter> filters){
		return "SELECT * FROM " + table + buildWhereClause(filters);
	}

	private String buildCountWhere(String table, List<Filter> filters){
		return "SELECT COUNT(1) AS c FROM " + table + buildWhereClause(filters);
	}

	/**
	 * 构造 WHERE 子句（仅结构，值由 bindFilterParams 绑定）。
	 *
	 * <p>注意：归档表无外键，不支持关联 createUserPO.currentName 查询。
	 * 业务侧如需按"操作人姓名"过滤历史，应改用 createUserId（账号）。
	 */
	private String buildWhereClause(List<Filter> filters){
		if (filters == null || filters.isEmpty()) return "";

		StringBuilder sb = new StringBuilder(" WHERE ");
		boolean first = true;
		for (Filter f : filters){
			if (f == null || !StringUtils.isNotEmpty(f.getData())) continue;
			String field = sanitizeFieldName(f.getField());
			if (field == null) continue;

			if (!first) sb.append(" AND ");
			first = false;

			String op = f.getOp();
			if ("between".equals(op)){
				sb.append(field).append(" BETWEEN :").append(field).append("_s AND :").append(field).append("_e");
			} else if ("cn".equals(op)){
				sb.append(field).append(" LIKE :").append(field);
			} else {
				sb.append(field).append(" = :").append(field);
			}
		}
		return first ? "" : sb.toString();
	}

	/** 字段名白名单：只允许已知字段，防 SQL 注入。 */
	private String sanitizeFieldName(String field){
		if (field == null) return null;
		if (field.equals("createTime") || field.equals("actionName") || field.equals("moduleId")
				|| field.equals("operateType") || field.equals("resultState") || field.equals("businessId")
				|| field.equals("ip") || field.equals("errorCode") || field.equals("traceId")
				|| field.equals("createUserId")){
			return field;
		}
		return null;
	}

	/**
	 * 绑定过滤参数值。
	 *
	 * <p>关键：Hibernate 的命名参数在 SQL 中出现多次时，setParameter 一次即可应用到所有位置，
	 * 因此 UNION ALL 的多个子查询都能正确绑到同样的值。
	 */
	private void bindFilterParams(SQLQuery query, List<Filter> filters){
		if (filters == null) return;
		for (Filter f : filters){
			if (f == null || !StringUtils.isNotEmpty(f.getData())) continue;
			String field = sanitizeFieldName(f.getField());
			if (field == null) continue;

			String op = f.getOp();
			String data = f.getData();

			if ("between".equals(op) && "createTime".equals(field)){
				String[] parts = data.split(",");
				if (parts.length == 2){
					query.setTimestamp(field + "_s", parseTs(parts[0], true));
					query.setTimestamp(field + "_e", parseTs(parts[1], false));
				}
			} else if ("createTime".equals(field)){
				query.setTimestamp(field, parseTs(data, true));
			} else if ("resultState".equals(field) || "errorCode".equals(field)){
				try {
					query.setInteger(field, Integer.valueOf(data));
				} catch (NumberFormatException ignore) { }
			} else {
				query.setString(field, "cn".equals(op) ? "%" + data + "%" : data);
			}
		}
	}

	/** 把前端传来的时间字符串解析为 Timestamp。只传日期时补 00:00:00 或 23:59:59。 */
	private Timestamp parseTs(String s, boolean start){
		if (s == null) return null;
		String trimmed = s.trim();
		if (trimmed.length() <= 10){
			trimmed = trimmed + (start ? " 00:00:00" : " 23:59:59");
		}
		return Timestamp.valueOf(trimmed);
	}


	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null)
			return;

		query.alias("createUserPO", "createUserPO");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (!StringUtils.isNotEmpty(data))
				continue;

			if ("createTime".equals(field) && "between".equals(op)) {
				query.timeranges("createTime", "createTime", data);
			} else if ("createTime".equals(field)) {
				query.add(getCriterion("createTime", data, op));
			} else if ("createUser".equals(field)) {
				query.add(getCriterion("createUserPO.currentName", (data), op));
			} else if ("createUserId".equals(field)) {
				query.add(getCriterion("createUserPO.userId", (data), op));
			} else if ("moduleId".equals(field)) {
				// Phase 2: 业务模块过滤（decoration/quotation/customer 等）
				query.add(getCriterion("moduleId", data, op));
			} else if ("businessId".equals(field)) {
				// Phase 2: 业务对象主键过滤（订单号/客户 ID）
				query.add(getCriterion("businessId", data, op));
			} else if ("operateType".equals(field)) {
				// Phase 2: 操作类型过滤（ADD/UPDATE/DELETE/QUERY/EXPORT）
				query.add(getCriterion("operateType", data, op));
			} else if ("resultState".equals(field)) {
				// Phase 2: 结果状态过滤（0成功 1失败 2异常）
				query.add(getCriterion("resultState", data, op));
			} else if ("ip".equals(field)) {
				// Phase 2: 来源 IP 过滤
				query.add(getCriterion("ip", data, op));
			} else if ("actionName".equals(field)) {
				// Phase 2: Action 路由名过滤
				query.add(getCriterion("actionName", data, op));
			} else if ("traceId".equals(field)) {
				// Phase 2: 链路追踪 ID 过滤
				query.add(getCriterion("traceId", data, op));
			} else if ("errorCode".equals(field)) {
				// Phase 2: 错误码过滤
				query.add(getCriterion("errorCode", data, op));
			} else {
				query.add(query.getCriterion(field, (data), op));
			}
		}
	}
}
