/**
 * @File Name		: ActionLogContext.java
 * @Package 		: com.fanglin.log.context
 * @Version			: 1.0
 * @Date			: 2026-07-20
 * @Copyright		: Copyright Creators
 * @Describing		: 业务侧主动绑定的操作日志上下文（请求级别 ThreadLocal）
 *
 *  使用说明：
 *    AccessInterceptor 在请求开始时调 begin()，结束时调 current()/clear()。
 *    业务 Service 在执行关键写操作时，可调用 bindBusinessId/bindOperateType
 *    把"这次操作影响的业务对象主键、操作类型"绑进来；切面/拦截器统一落库时
 *    读取这些字段写入 actionLog 表。
 *
 *  典型用法：
 *    public void updateCustomer(CustomerVO vo) {
 *        ActionLogContext.bind("customer", vo.getCustomerId(), "UPDATE");
 *        customerDao.update(...);
 *    }
 *
 *    ActionLogContext.bind(module, businessId, operateType) 是 sugar，
 *    等价于分三次调 bind 方法。
 */

package com.fanglin.log.context;

/**
 * 请求级别的操作日志上下文。
 *
 * <p>设计要点：
 * <ul>
 *   <li>ThreadLocal 持有 Holder，与 servlet 请求线程一一对应。</li>
 *   <li>所有 bind 方法仅修改当前线程副本，线程结束/请求清理时统一 clear。</li>
 *   <li>对业务侧零侵入：业务不需要 import 任何 Spring/Struts 类，仅依赖本类。</li>
 *   <li>避免内存泄漏：AccessInterceptor 必须在 finally 里 clear（参考 LoginInterceptor 模式）。</li>
 * </ul>
 */
public final class ActionLogContext {

	private ActionLogContext(){
		// 工具类，禁止实例化
	}

	private static final ThreadLocal<Holder> CTX = new ThreadLocal<Holder>();

	/** 进入请求时调用，初始化当前线程的 Holder。 */
	public static void begin(){
		CTX.set(new Holder());
	}

	/** 业务侧绑定业务模块（如 "customer"/"decoration"）。 */
	public static void bindModule(String module){
		Holder h = ensure();
		if (h != null) h.module = module;
	}

	/** 业务侧绑定业务对象主键（订单号/客户 ID 等）。 */
	public static void bindBusinessId(String businessId){
		Holder h = ensure();
		if (h != null) h.businessId = businessId;
	}

	/** 业务侧绑定操作类型（ADD/UPDATE/DELETE/EXPORT 等）。 */
	public static void bindOperateType(String operateType){
		Holder h = ensure();
		if (h != null) h.operateType = operateType;
	}

	/** 一次性绑定 module/businessId/operateType 三个字段（sugar）。 */
	public static void bind(String module, String businessId, String operateType){
		Holder h = ensure();
		if (h == null) return;
		h.module = module;
		h.businessId = businessId;
		h.operateType = operateType;
	}

	/**
	 * 读取并清理当前线程的上下文。
	 *
	 * <p>AccessInterceptor 在请求结束时调用，拿到的 Holder 用于填充
	 * ActionLogPO 的 module/businessId/operateType 字段，并清理 ThreadLocal
	 * 避免内存泄漏。
	 *
	 * @return 当前线程的 Holder；若未调过 begin() 返回 null
	 */
	public static Holder current(){
		return CTX.get();
	}

	/** 清理当前线程的 ThreadLocal，必须在请求结束时调用。 */
	public static void clear(){
		CTX.remove();
	}

	private static Holder ensure(){
		Holder h = CTX.get();
		if (h == null){
			// 兜底：业务侧忘了 begin 也允许 bind（多数情况下 AccessInterceptor 已 begin）
			h = new Holder();
			CTX.set(h);
		}
		return h;
	}

	/**
	 * 上下文数据载体。包级可见，仅供 ActionLogRecorder 读取字段。
	 */
	public static class Holder {
		private String module;
		private String businessId;
		private String operateType;

		public String getModule(){
			return module;
		}

		public String getBusinessId(){
			return businessId;
		}

		public String getOperateType(){
			return operateType;
		}
	}

}
