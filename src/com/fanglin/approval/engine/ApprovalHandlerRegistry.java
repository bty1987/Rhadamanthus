/**
 * @File Name		: ApprovalHandlerRegistry.java
 * @Package   		: com.fanglin.approval.engine
 * @Version			: 1.0
 * @Description		: 审批处理器注册中心。Spring 启动时自动收集所有 {@link ApprovalNodeHandler} Bean,
 * 					  按 {@link ApprovalNodeHandler#businessType()} 建立索引,供 ApprovalServiceImpl
 * 					  查询分发,替代原巨型 switch-case。
 */

package com.fanglin.approval.engine;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 审批处理器注册中心。
 * <p>Spring 会把容器中所有 {@link ApprovalNodeHandler} 实现注入到 {@link #handlers} 列表,
 * {@link #init()} 阶段按业务类型建索引。
 * <p>线程安全:注册在启动期完成,运行期只读,无需加锁。
 */
@Component
public class ApprovalHandlerRegistry {

	@Autowired(required = false)
	private List<ApprovalNodeHandler> handlers;

	private final Map<Short, ApprovalNodeHandler> index = new HashMap<Short, ApprovalNodeHandler>();

	@PostConstruct
	public void init() {

		if (handlers == null || handlers.isEmpty()) {
			return;
		}

		for (ApprovalNodeHandler handler : handlers) {
			ApprovalNodeHandler exists = index.put(handler.businessType(), handler);
			if (exists != null) {
				throw new IllegalStateException(String.format("审批处理器业务类型冲突: type=%d 既有 %s 又注册 %s",
					handler.businessType(), exists.getClass().getName(), handler.getClass().getName()));
			}
		}
	}

	/**
	 * 按业务类型查询处理器。
	 *
	 * @param businessType 业务审批类型,对应 {@link ApprovalPO#getType()}
	 * @return 对应处理器;当前类型尚未迁移到 SPI 时返回 {@code null},调用方应回退到遗留 switch
	 */
	public ApprovalNodeHandler lookup(short businessType) {
		return index.get(businessType);
	}

	/**
	 * 判断指定业务类型是否已接入 SPI(用于区分走新分发还是走遗留 switch)。
	 */
	public boolean supports(short businessType) {
		return index.containsKey(businessType);
	}

}
