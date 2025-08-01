/** @odoo-module */

import { PaymentScreen } from "@point_of_sale/app/screens/payment_screen/payment_screen";
import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";
import { usePos } from "@point_of_sale/app/store/pos_hook";

patch(PaymentScreen.prototype, {
    setup() {
        super.setup();
        this.orm = useService("orm");
        this.pos = usePos();
    },
    async validateOrder(isForceValidate) {
        // CORRECCIÓN: Usar spread operator (...arguments)
        let receipt_order = await super.validateOrder(...arguments);  // <-- Aquí el cambio
        
        // Verificar existencia de datos
        const data = this.env.services.pos.session_orders || [];
        if (data.length === 0) {
            return receipt_order;
        }
        
        const lastIndex = data.length - 1;
        const order = data[lastIndex];
        
        // Verificar si order existe antes de acceder
        if (!order) {
            return receipt_order;
        }

        // Asignar valores con defaults
        this.pos.customer_details = order.customer_details || '';
        this.pos.mobile = order.customer_mobile || '';
        this.pos.phone = order.customer_phone || '';
        this.pos.email = order.customer_email || '';
        this.pos.vat = order.customer_vat || '';
        this.pos.address = order.customer_address || '';
        this.pos.name = order.customer_name || '';
        
        return receipt_order;
    },
});